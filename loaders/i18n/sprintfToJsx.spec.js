const assert = require('assert');
const sprintfToJsx = require('./sprintfToJsx');

assert.strictEqual(
  sprintfToJsx('x'),
  '() => \'x\''
);

assert.strictEqual(
  sprintfToJsx('x', { wrap: true }),
  '() => <span>x</span>'
);

assert.strictEqual(
  sprintfToJsx('ab %(bc)s cd %(de)s ef', { wrap: true }),
  '({bc, de}) => <span>ab {bc} cd {de} ef</span>'
);

assert.strictEqual(
  sprintfToJsx('a <i>b</i>', { wrap: true }),
  '() => <span>a <i>b</i></span>'
);

assert.strictEqual(
  sprintfToJsx('<span>x</span>'),
  '() => <span>x</span>'
);

assert.strictEqual(
  sprintfToJsx('<span>x</span>', { wrap: true }),
  '() => <span>x</span>'
);

assert.strictEqual(
  sprintfToJsx('<div>x</div>'),
  '() => <div>x</div>'
);

assert.strictEqual(
  sprintfToJsx('<div>x</div>', { wrap: true }),
  '() => <div>x</div>'
);

assert.strictEqual(
  sprintfToJsx('<span attr="x">y</span>'),
  '() => <span attr="x">y</span>'
);

// TODO; lookup jsx property translation rules
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
  '({b}) => <span attr={\'a \'+b+\' c\'}/>'
);

assert.strictEqual(
  sprintfToJsx('<span attr="a %(b)s c">x</span>'),
  '({b}) => <span attr={\'a \'+b+\' c\'}>x</span>'
);

assert.strictEqual(
  sprintfToJsx('<span>x</span>'),
  '() => <span>x</span>'
);

assert.strictEqual(
  sprintfToJsx('a <span>b</span> c'),
  '() => [\'a \',<span key="1">b</span>,\' c\']'
);

assert.strictEqual(
  sprintfToJsx('a <span key="x">b</span> c'),
  '() => [\'a \',<span key="x">b</span>,\' c\']'
);

assert.strictEqual(
  sprintfToJsx('a %(b)s c'),
  '({b}) => [\'a \',ensureKey(b,\'0-1\'),\' c\']'
);

assert.strictEqual(
  sprintfToJsx(`'`),
  '() => \'\\\'\''
);

assert.strictEqual(
  sprintfToJsx('<span></span>'),
  '() => <span/>'
);

assert.strictEqual(
  sprintfToJsx('hello\nworld'),
  '() => \'hello\\nworld\''
);

assert.strictEqual(
  sprintfToJsx('<span>hello\nworld</span>'),
  '() => <span>hello\nworld</span>'
);

assert.strictEqual(
  sprintfToJsx(''),
  '() => null'
);

assert.strictEqual(
  sprintfToJsx('<!-- hello -->'),
  '() => null'
);

assert.strictEqual(
  sprintfToJsx('<!-- hello --><!-- world -->'),
  '() => null'
);

assert.strictEqual(
  sprintfToJsx('<!-- hello -->x<!-- world -->'),
  '() => \'x\''
);

assert.strictEqual(
  sprintfToJsx('<!-- hello --><span>x</span><!-- world -->'),
  '() => <span>x</span>'
);

assert.strictEqual(
  sprintfToJsx('<span attr"></span>'),
  '() => <span/>'
);

assert.strictEqual(
  sprintfToJsx('<span x-y="z"></span>'),
  '() => <span x-y="z"/>'
);

assert.strictEqual(
  sprintfToJsx('%(a)s'),
  '({a}) => ensureKey(a,\'0-0\')'
);

console.log('All test pass');
