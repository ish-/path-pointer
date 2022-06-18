import PathPointer, { createGetter, createSetter } from './path-pointer.js';

describe('PathPointer', () => {
  it('should get "one.nested" prop', () => {
    const o = { one: true };

    const v = createGetter(o, 'one')();
    expect(v).toBe(o.one);
  })

  it('should get "one.two.nested" prop', () => {
    const o = { one: { two: true } };

    const v = createGetter(o, 'one.two')();
    expect(v).toBe(o.one.two);
  })

  it('should get "one.two.undefined" prop', () => {
    const o = { one: { two: true } };

    const v = createGetter(o, 'one.two.undefined')();
    expect(v).toBe(o.one.two.undefined);
  })

  it('should get "one.two.null" prop', () => {
    const o = { one: { two: null } };

    const v = createGetter(o, 'one.two.undefined')();
    expect(v).toBe(undefined);
  })

  it('should set "one.nested" prop', () => {
    const o = {};

    const v = createSetter(o, 'one')(true);
    expect(v).toBe(o);
    expect(o.one).toBe(true);
  })

  it('should set "one.two.nested" prop', () => {
    const o = { one: null };

    const v = createSetter(o, 'one.two')(true);
    expect(v).toBe(o.one);
    expect(o.one.two).toBe(true);
  })

  it('should set "one[1].nested" prop', () => {
    const o = { one: null };

    const v = createSetter(o, 'one[1].value')(true);
    expect(v).toBe(o.one[1]);
    expect(o.one[1].value).toBe(true);
  })

  it('should set "[1].value" prop', () => {
    const o = { one: null };

    const v = createSetter(o, '[1].value')(true);
    expect(v).toBe(o[1]);
    expect(o[1].value).toBe(true);
  })

  it('should construct new PathPointer(object, path)', () => {
    const o = { one: { two: true } };

    const pointer = new PathPointer(o, 'one.two');
    pointer.set(2);
    const v = pointer.get();

    expect(v).toBe(2);
  })

  it('should construct new PathPointer(path) \\wo object', () => {
    const o = { one: { two: true } };

    const pointer = new PathPointer('one.two');
    pointer.set(o, 2);
    const v = pointer.get(o);

    expect(v).toBe(2);
  })

  it('should get quoted "one[\'two\'] prop"', () => {
    const o = { one: { two: true } };

    const v = createGetter(o, 'one[\'two\']')();
    
    expect(v).toBe(true);
  })

  it('should push into "one[]"', () => {
    const o = {};

    const setter = createSetter(o, 'one[]');
    setter(1);
    expect(o.one[0]).toBe(1);
    
    setter(2);
    expect(o.one[1]).toBe(2);
  })

  it('should set {value} pushed into "one[]"', () => {
    const o = {};

    const setter = createSetter(o, 'one[].value');
    setter(1);
    expect(o.one[0].value).toBe(1);
    
    setter(2);
    expect(o.one[1].value).toBe(2);
  })
});
