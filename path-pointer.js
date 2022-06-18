import {  arrChar, chainFromPath } from './utils.js';

export function createSetter (...args) {
  const path = args.length === 2 ? args[1] : args[0];
  const o = args.length === 2 ? args[0] : undefined;
  let fn;
  let chain = chainFromPath(path);

  const len = chain.length;
  if (len < 2)
    fn = (o, v) => {
      o[chain[0]] = v;
      return o;
    };

  else {
    const line = chain.slice(0, len - 1).reduce((arr, key, i) => {
      let nextIsArr = chain[i+1].charAt(0) === arrChar;
      const next = nextIsArr ? '[]' : '{}';
      key = key.replace(arrChar, '');
      let refKey = `_ref['${key}']`;
      let assign = `${refKey} = ${next}`;

      let str;
      if (!key)
        str = `
          _ref.push(${next}); _ref = _ref[_ref.length-1]
        `;
      else
        str = `
          _ref = ${refKey} == undefined ? (${ assign }) : ${refKey}
        `;
        // (_ref = (${refKey} = ${refKey} === undefined ? (next) : ${refKey}))
      arr.push(str);
      return arr;
    }, []);

    let key = chain[len-1].replace(arrChar, '');
    let assign = `_ref['${key}'] = v`;
    if (!key)
      assign = `_ref.push(v)`;

    const fnStr = `
      let _ref = o;
      let next;
      ${ line.join(';\n') };
      ${ assign };
      return _ref;
    `;

    fn = new Function('o', 'v', fnStr);
  }
  return o !== undefined
    ? function _setter (v) { return fn(o, v) }
    : fn;
}

export function createGetter (...args) {
  const path = args.length === 2 ? args[1] : args[0];
  const o = args.length === 2 ? args[0] : undefined;
  let fn;
  let chain = chainFromPath(path);

  const len = chain.length;
  if (len < 2)
    fn = (o) => o[chain[0]];

  else {
    const line = chain.reduce((arr, key, i) => {
      let prev = arr[i - 1] || '';
      if (prev)
        prev += '\']';

      arr.push(`${prev}[\'${key.replace(arrChar, '')}`)
      return arr;
    }, []);
    const fnStr = `
      return o${ line.join('\'] != undefined && o') }'] || undefined;
    `;
    fn = new Function('o', fnStr);
  }

  return o !== undefined ? 
    function _getter () { return fn(o) }
  : fn;
}

export default function PathPointer (...args) {
  return {
    get: createGetter(...args),
    set: createSetter(...args),
  };
}
