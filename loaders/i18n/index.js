const loaderUtils = require('loader-utils');
const sprintfToJsx = require('./sprintfToJsx');

module.exports = function (source) {
  const { prefix = 'I18n_' } = loaderUtils.getOptions(this) || {};
  const locale = JSON.parse(source);

  const tagComponents = Object.entries(locale)
    .map(([tag, message]) => `export const ${prefix}${tag} = ${sprintfToJsx(message)}`);

  const body = [
    `import React from 'react';`,
    tagComponents.join('\n')
  ].join('\n');

  console.log(body);
  return body;
};
