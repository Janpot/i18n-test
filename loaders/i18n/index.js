const loaderUtils = require('loader-utils');
const sprintfToJsx = require('./sprintfToJsx');

module.exports = function (source) {
  const { prefix = 'I18n_', wrap = false } = loaderUtils.getOptions(this) || {};
  const locale = JSON.parse(source);

  const tagComponents = Object.entries(locale)
    .map(([tag, message]) => `export const ${prefix}${tag} = ${sprintfToJsx(message, { wrap })}`);

  const body = [
    `import React from 'react';`,
    `const ensureKey = (elm, key) => React.isValidElement(elm) ? React.cloneElement(elm,{key}) : elm;`,
    tagComponents.join('\n')
  ].join('\n');

  console.log(body);
  return body;
};
