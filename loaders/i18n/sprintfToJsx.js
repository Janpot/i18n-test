const parse5 = require('parse5');
const treeAdapter = parse5.treeAdapters.default;
const jsStringEscape = require('js-string-escape');

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
    })
    .filter(({ type, value }) => (type === 'text' && value) || type !== 'text');
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

function serializeNodesToJsx (nodes, context) {
  return nodes
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
              return `'${jsStringEscape(node.value)}'`;
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

function serializeOpeningTagToJsx (node, context, key = null, selfClosing = false) {
  const tagName = treeAdapter.getTagName(node);
  const attributes = treeAdapter.getAttrList(node);
  const alreadyHasKey = attributes.some(({name}) => name === 'key');
  const openingTagContent = [
    tagName,
    ...attributes
      // TODO: figure out how JSX maps attribute
      .filter(({name}) => /^[a-zA-Z0-9-]*$/.test(name))
      .map(attribute => serializeAttributeToJsx(attribute, context)),
    ...(key && !alreadyHasKey ? [`key="${key}"`] : [])
  ].join(' ');
  return `<${openingTagContent}${selfClosing ? '/' : ''}>`;
}

function serializeClosingTagToJsx (node, context) {
  const tagName = treeAdapter.getTagName(node);
  return `</${tagName}>`;
}

function serializeNodeToJsx (node, context, key = null) {
  if (treeAdapter.isElementNode(node)) {
    const childNodes = treeAdapter.getChildNodes(node);
    if (childNodes.length <= 0) {
      return serializeOpeningTagToJsx(node, context, key, true);
    } else {
      return [
        serializeOpeningTagToJsx(node, context, key, false),
        serializeNodesToJsx(childNodes, context),
        serializeClosingTagToJsx(node, context)
      ].join('');
    }
  } else if (treeAdapter.isTextNode(node)) {
    const textContent = treeAdapter.getTextNodeContent(node);
    return serializeTextContentToJsx(textContent, context);
  }
}

function serializeTextFragment (node, context, keyBase) {
  const textContent = treeAdapter.getTextNodeContent(node);
  return parseSprintf(textContent)
    .map((node, i) => {
      switch (node.type) {
        case 'text': return `'${jsStringEscape(node.value)}'`;
        case 'variable':
          context.params.add(node.name);
          const key = `${keyBase}-${i}`;
          return `ensureKey(${node.name},'${key}')`;
        default: throw new Error(`Unknown AST node type "${node.type}"`);
      }
    });
}

function serializeToJsx (ast) {
  const context = {
    params: new Set()
  };

  const fragmentValues = treeAdapter.getChildNodes(ast)
    .reduce((fragmentValues, node, i, childNodes) => {
      if (treeAdapter.isTextNode(node)) {
        return fragmentValues.concat(serializeTextFragment(node, context, String(i)));
      } else {
        const key = childNodes.length > 1 ? String(i) : null;
        return fragmentValues.concat([serializeNodeToJsx(node, context, key)]);
      }
    }, []);
  const paramsDecl = context.params.size > 0 ? `{${Array.from(context.params).join(', ')}}` : '';
  const jsxBody = fragmentValues.length === 1 ? fragmentValues[0] : `[${fragmentValues.join(',')}]`;
  return `(${paramsDecl}) => ${jsxBody}`;
}

module.exports = function (sprintfStr, { wrap = false } = {}) {
  const rawAst = parse5.parseFragment(sprintfStr, { treeAdapter });
  const ast = wrap ? ensureToplevelTag(rawAst) : rawAst;
  return serializeToJsx(ast);
};
