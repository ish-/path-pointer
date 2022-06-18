## PathPointer · [![npm version](https://badge.fury.io/js/@ish_%2Fpath-pointer.svg)](//npmjs.com/package/@ish_/path-pointer)
Create fast getter/setter functions precompiled with `new Function()`, pointing to path destination.

Precompiling takes perceptible performance growth if you use these once binded functions many times. Look at `./profiling.js` where it is compared with `lodash` versions. "READY" functions are 7-20x faster. Obviously, "cold" way are only 3x slower cause of compiling time. So use it in right cases :)

### Usage
```js
import PathPointer, { createGetter, createSetter } from '@ish_/path-pointer';
const obj = {};

const set = createSetter(obj, 'one.two[1].value', 1);
set(true);
// expect(obj.one.two[1].value).toBe(true);

const get = createGetter(obj, 'one.two[1].value');
const value = get();
// expect(value).toBe(true);

const path = 'items["id123"].value';
const pp = new PathPointer(obj, path);
set('pushed');
const pushedValue = p.get();
// expect(pushedValue).toBe('pushed');
```