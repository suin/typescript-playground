import assert = require('assert')

function immutable(constructor: any): any {
  const wrapper = function () {
    const instance = new constructor(...arguments)
    Object.freeze(instance)
    return instance
  }
  wrapper.prototype = Object.create(constructor.prototype)
  return wrapper
}

@immutable
class Sample {
  constructor(public readonly foo: number) {
  }
}

const sample = new Sample(0)

assert.strictEqual(sample.foo, 0)
assert.throws(
  () => eval(`sample.foo = 1`),
  /^TypeError: Cannot assign to read only property 'foo' of object '#<Sample>'$/
)
assert.strictEqual(sample.foo, 0)
