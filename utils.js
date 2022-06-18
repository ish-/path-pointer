export const reEscapeChar = /\\(\\)?/g;

export const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

export const arrChar = '√';

export function chainFromPath (path) {
  if (Array.isArray(path))
    return path;

  let chain = [];
  path.replace(rePropName, function(match, number, quote, subString) {
    if (!match)
      match = arrChar;
    chain.push(quote ? subString.replace(reEscapeChar, '$1') : (number ? `${arrChar}${number}` : match));
  });
  return chain;
}

