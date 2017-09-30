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
export const I18n_interpolated_tag = ({sub1, sub2}) => <span>Here's some substitution: {sub1}, and another: {sub2}</span>;

// react >= 16.0.0
import React from 'react';
const ensureKey = (elm, key) => React.isValidElement(elm) ? React.cloneElement(elm,{key}) : elm;
export const I18n_interpolated_tag = ({sub1, sub2}) => ['Here\'s some substitution: ',ensureKey(sub1,'0-1'),', and another: ',ensureKey(sub2,'0-3')]
```

It renders fragments when used in react 16. On lower versions it will automatically wrap with a `<span>`

Using webpack aliases we can resolve the correct locale to a certain module identifier (e.g. `i18n`)
then, to use this component, just do like any other:

```
import { I18n_interpolated_tag } from 'i18n';
<I18n_interpolated_tag sub1="hello" sub2="world" />
```

### advantages:
* Performant: no extra processing of messages when included in the markup
* part of the bundle, so no extra requests required
* Size: only import the tags you want. tree-shake what's not imported
* Highly compatible with our current messageformat
* Supports interpolation of components
* Safe: relies on react escaping
* Missing/invalid tags caught at compile time

### disadvantages:
* very naive `sprinf` parser. It only recognozes `%(...)s` for now
* Ugly component names. We can make this naming configurable. But we're a bit limited by how tree shaking works. I wish something like `import { some_tag, some_other_tag } as I18n from 'i18n'` was possible.
* need to rebuild when translations change in production
