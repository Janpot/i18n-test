const loaderUtils = require('loader-utils');
const sprintfToJsx = require('./sprintfToJsx');
const semver = require('semver');

module.exports = function (source) {
  const { prefix = 'I18n_' } = loaderUtils.getOptions(this) || {};
  const locale = JSON.parse(source);
  const wrap = semver.major(require('react').version) < 16;

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
