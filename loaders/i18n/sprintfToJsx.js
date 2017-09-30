const parse5 = require('parse5');
const treeAdapter = parse5.treeAdapters.default;

function parseSprintf (sprintfStr) {
  return sprintfStr
    .split(/%\(([a-zA-Z][a-zA-Z0-9]*)\)s/g)
    .map((part, i) => {
      return i % 2 === 0 ? {
        type: 'text',
        value: part
      } : {
        type: 'variable',
        name: part
      };
    });
}

function serializeTextContentToJsx (content, context) {
  return parseSprintf(content)
    .map(node => {
      switch (node.type) {
        case 'text': return node.value;
        case 'variable':
          context.params.add(node.name);
          return `{${node.name}}`;
        default: throw new Error(`Unknown AST node type "${node.type}"`);
      }
    })
    .join('');
}

function ensureToplevelTag (ast) {
  const childNodes = treeAdapter.getChildNodes(ast);
  if (childNodes.length === 1 && treeAdapter.isElementNode(childNodes[0])) {
    return ast;
  }
  const span = treeAdapter.createElement('span', null, []);
  Array.from(childNodes).forEach(child => {
    treeAdapter.detachNode(child);
    treeAdapter.appendChild(span, child);
  });
  treeAdapter.appendChild(ast, span);
  return ast;
}

function serializeChildNodesToJsx (node, context) {
  return treeAdapter.getChildNodes(node)
    .map(node => serializeNodeToJsx(node, context))
    .join('');
}

function serializeAttributeNameToJsx (name, context) {
  return name === 'class' ? 'className' : name;
}

function serializeAttributeValueToJsx (value, context) {
  const sprintfAst = parseSprintf(value);
  if (sprintfAst.length === 1 && sprintfAst[0].type === 'text') {
    return `"${sprintfAst[0].value}"`;
  } else {
    const attributeValueExpression = sprintfAst
      .map(node => {
        switch (node.type) {
          case 'text':
            if (node.value === '') {
              return null;
            } else {
              return `'${node.value.replace(/'/, '\\\'')}'`;
            }
          case 'variable':
            context.params.add(node.name);
            return node.name;
          default: throw new Error(`Unknown AST node type "${node.type}"`);
        }
      })
      .filter(part => part)
      .join('+');
    return `{${attributeValueExpression}}`;
  }
}

function serializeAttributeToJsx ({ name, value }, context) {
  return [
    serializeAttributeNameToJsx(name, context),
    serializeAttributeValueToJsx(value, context)
  ].join('=');
}

function serializeOpeningTagToJsx (node, context) {
  const tagName = treeAdapter.getTagName(node);
  const attributes = treeAdapter.getAttrList(node);
  const openingTagContent = [
    tagName,
    ...attributes.map(attribute => serializeAttributeToJsx(attribute, context))
  ].join(' ');
  return `<${openingTagContent}>`;
}

function serializeClosingTagToJsx (node, context) {
  const tagName = treeAdapter.getTagName(node);
  return `</${tagName}>`;
}

function serializeNodeToJsx (node, context) {
  if (treeAdapter.isElementNode(node)) {
    return [
      serializeOpeningTagToJsx(node, context),
      serializeChildNodesToJsx(node, context),
      serializeClosingTagToJsx(node, context)
    ].join('');
  } else if (treeAdapter.isTextNode(node)) {
    const textContent = treeAdapter.getTextNodeContent(node);
    return serializeTextContentToJsx(textContent, context);
  } else {
    return serializeChildNodesToJsx(node, context);
  }
}

function serializeToJsx (node) {
  const context = {
    params: new Set()
  };
  const jsxBody = serializeNodeToJsx(node, context);
  const paramsDecl = context.params.size > 0 ? `{${Array.from(context.params).join(', ')}}` : '';
  return `(${paramsDecl}) => ${jsxBody}`;
}

module.exports = function (sprintfStr) {
  const ast = parse5.parseFragment(sprintfStr, { treeAdapter });
  return serializeToJsx(ensureToplevelTag(ast));
};
