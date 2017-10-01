const sprintfToJsx = require('./sprintfToJsx');
const semver = require('semver');

function isValidJsIdentifier (id) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(id);
}

module.exports = function (source) {
  const locale = JSON.parse(source);
  const wrap = semver.major(require('react').version) < 16;

  const tagComponents = Object.entries(locale)
    .map(([tag, message]) => {
      if (isValidJsIdentifier(tag)) {
        return `export const ${tag} = ${sprintfToJsx(message, { wrap })}`;
      } else {
        this.emitWarning(`Invalid message id "${tag}"`);
        return `// Invalid message id "${tag}"`;
      }
    });

  const body = [
    `import React from 'react';`,
    `const ensureKey = (elm, key) => React.isValidElement(elm) ? React.cloneElement(elm,{key}) : elm;`,
    tagComponents.join('\n')
  ].join('\n');

  console.log(body);
  return body;
};
