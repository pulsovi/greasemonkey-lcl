var filter = [
  '__stylesheet__',
  'alternate',
  'lastEffect',
  'nextEffect',
  'observing',
  'Props.styles',
  'props.styles',
  'return',
  'sibling',
  'stateNode',
];

var cachePath = [];

// eslint-disable-next-line complexity
function stringify (obj, cache = [], path = 'root') {
  if (filter.some(key => path.endsWith(key))) return '"#Filtered"';
  if (path.length > 400) {
    console.info(path);
    throw new Error('too long path');
  }
  if (['function', 'object', 'symbol'].includes(typeof obj)) {
    if (cache.includes(obj)) {
      const index = cache.indexOf(obj);
      return `"#Circular${index}"`;
    }
    cache.push(obj);
    cachePath.push(path);
  }
  switch (typeof obj) {
  case 'function':
    try {
      return `{ "type": "#Function", "subkeys": {${Object.entries(obj)
        .map(([key, value]) => `${JSON.stringify(key)}:${stringify(value, cache, `${path}.${key}`)}`)
        .join(',')
      }}}`;
    } catch (error) {
      return '"#Function"';
    }
  case 'object':
    if (obj === null) return 'null';
    return `{${Object.entries(obj)
      .map(([key, value]) => `${JSON.stringify(key)}:${stringify(value, cache, `${path}.${key}`)}`)
      .join(',')
    }}`;
  case 'number': return `${obj}`;
  case 'undefined': return '"undefined"';
  case 'boolean':
  case 'string': return JSON.stringify(obj);
  case 'symbol':
    return `{ "type": "#Symbol", "value": ${JSON.stringify(obj.description)}}`;
  default: throw new Error(`le type d'objet ${typeof obj} n'est pas pris en charge`);
  }
}

a = stringify(b);
copy(a);
