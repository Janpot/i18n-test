const assert = require('assert');
const sprintfToJsx = require('./sprintfToJsx');

assert.strictEqual(
  sprintfToJsx('Some random string'),
  '() => <span>Some random string</span>'
);

assert.strictEqual(
  sprintfToJsx('Here\'s some substitution: %(sub1)s, and another: %(sub2)s'),
  '({sub1, sub2}) => <span>Here\'s some substitution: {sub1}, and another: {sub2}</span>'
);

assert.strictEqual(
  sprintfToJsx('nested <i>markup</i>'),
  '() => <span>nested <i>markup</i></span>'
);

assert.strictEqual(
  sprintfToJsx('<span>x</span>'),
  '() => <span>x</span>'
);

assert.strictEqual(
  sprintfToJsx('<div>x</div>'),
  '() => <div>x</div>'
);

assert.strictEqual(
  sprintfToJsx('<span attr="x">y</span>'),
  '() => <span attr="x">y</span>'
);

assert.strictEqual(
  sprintfToJsx('<span class="x">y</span>'),
  '() => <span className="x">y</span>'
);

assert.strictEqual(
  sprintfToJsx('<a href="%(url)s">%(text)s</a>'),
  '({url, text}) => <a href={url}>{text}</a>'
);

assert.strictEqual(
  sprintfToJsx('<span attr="a %(b)s c"></span>'),
  '({b}) => <span attr={\'a \'+b+\' c\'}></span>'
);

console.log('All tests pass');
