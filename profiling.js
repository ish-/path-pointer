import { createGetter, createSetter } from "./path-pointer.js";
import lodash from 'lodash'; // npm i lodash

const o = { next: [1], nextL: [1] };
let setter = createSetter(o, 'next[1].value');
let getter = createGetter(o, 'next[1]');
const res = setter(1);

function profile (name, fn, count = 1e4) {
  console.time(name);
  for(let i = 0; i < count; i++)
    fn();
  console.timeEnd(name);
}

// const start = Date.now();
const chain = (() => {
  const queue = [];

  setTimeout(() => {
    queue.reduce((acc, fn, i) => {
      return acc.then(() => {
        fn();
        return new Promise(r => setTimeout(r, 300));
      })
    }, Promise.resolve());
  });

  return function pushToChain (fn) {
    queue.push(fn);
  }
})();

// chain(() => Date.now() - start);
// chain(() => Date.now() - start);
// chain(() => Date.now() - start);
// chain(() => Date.now() - start);
chain(() => {
  console.log('=====');
  profile('READY setter', () => setter(Math.random()), 1e3);
  profile('lodash.set', () => lodash.set(o, 'nextL[1]', Math.random()), 1e3);
})
chain(() => {
  console.log('=====');
  profile('READY getter', () => getter(), 1e3);
  profile('lodash.get', () => lodash.get(o, 'nextL[1]'), 1e3);
})
chain(() => {
  console.log('=====');
  profile('cold:( setter', () => createSetter(o, 'next[1]')(Math.random()), 100);
  profile('lodash.set', () => lodash.set(o, 'nextL[1]', Math.random()), 100);
})
chain(() => {
  console.log('=====');
  profile('cold:( getter', () => createGetter(o, 'next[1]')(), 100);
  profile('lodash.get', () => lodash.get(o, 'nextL[1]'), 100);
})
