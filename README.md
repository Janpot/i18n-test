# WooRank i18n experiment

Precompiles our messages format (sprintf) to react components.
Uses webpack aliases to create multiple bundles, one for each locale.

## How it works:

a special loader for `client/locales/*.json` which transforms the contained tags to react compomnents.

for instance:

```json
{
  "interpolated_tag": "Here's some substitution: %(sub1)s, and another: %(sub2)s"
}
```

becomes:

```jsx
// react < 16.0.0
import React from 'react';
export const interpolated_tag = ({sub1, sub2}) => <span>Here's some substitution: {sub1}, and another: {sub2}</span>;

// react >= 16.0.0
import React from 'react';
const ensureKey = (elm, key) => React.isValidElement(elm) ? React.cloneElement(elm,{key}) : elm;
export const interpolated_tag = ({sub1, sub2}) => ['Here\'s some substitution: ',ensureKey(sub1,'0-1'),', and another: ',ensureKey(sub2,'0-3')]
```

It renders fragments when used in react 16. On lower versions it will automatically wrap with a `<span>`

Using webpack aliases we can resolve the correct locale to a certain module identifier (e.g. `i18n`)
then, to use this component, just do like any other:

```jsx
import React from 'react';
import * as I18n from 'i18n';
class MyComponent extends React.Component {
  render () {
    return (
      <div>
        <I18n.interpolated_tag sub1="hello" sub2="world" />
      </div>
    );
  }
}
```

## project configuration

### loader

To enable the i18n loader on the locale files:

```js
{
  // ...
  module: {
    loaders: [
      // ...
      {
        test: /\.json$/,
        include: path.resolve(__dirname, '../client/locales'),
        use: [ { loader: 'babel-loader' }, { loader: 'i18n' } ]
      }
    ]
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../loaders')]
  }
}
```

### localized bundles

To create a bundle for a specific locale:

```js
const locale = 'en'
{
  // ...
  output: {
    path: path.resolve(__dirname, `../dist/${locale}`)
  },
  resolve: {
    alias: {
      i18n: path.resolve(__dirname, `../client/locales/${locale}.json`)
    }
  }
}
```

### tree shaking

Turn off modules in `.babelrc`:

```json
{
    "presets":[ ["env", { "modules": false }], "react" ]
}
```

use `uglifyjs-webpack-plugin`:

```js
{
  // ...
  plugins: [ new UglifyJSPlugin() ]
}
```

## Conclusion

### advantages:
* Performant: no extra processing of messages when included in the markup
* part of the bundle, so no extra requests required
* Size: only import the tags you want. tree-shake what's not imported
* Highly compatible with our current messageformat
* Supports interpolation of components
* Safe: relies on react escaping
* Missing/invalid tags caught at compile time
* Since these are react components, it's possible to add extra behaviour to them for our translation tooling, like a debug mode, or maybe even live editing

### disadvantages:
* Very naive `sprinf` parser. It only recognozes `%(...)s` for now
* Extra compile time, needs optimization
* Need to rebuild when translations change in production
