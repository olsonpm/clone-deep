'use strict'

//---------//
// Imports //
//---------//

const chai = require('chai'),
  cloneDeep = require('../lib')

//
//------//
// Init //
//------//

chai.should()

//
//------//
// Main //
//------//

//
// complex tests: these are mostly just leftover from pvorb/clone and rewritten
//   to use mocha/chai.  Unlike the simple tests, I didn't a lot of time
//   simplifying  nor organizing.  That's for another time, probably never ;)
//

suite('complex', () => {
  test('object containing array', () => {
    const a = {
      anArray: ['a'],
    }

    cloneDeep(a).should.deep.equal(a)
  })

  test('object with circular reference', () => {
    const max = { name: 'max' }

    max.myself = max

    const cloneOfMax = cloneDeep(max)

    cloneOfMax.should.deep.equal(max)
    cloneOfMax.myself.should.equal(cloneOfMax)
    cloneOfMax.myself.should.not.equal(max)
  })

  test('maintain prototype chain in clones', () => {
    function T() {}

    const a = new T(),
      b = cloneDeep(a)

    Reflect.getPrototypeOf(a).should.equal(Reflect.getPrototypeOf(b))
  })

  test('symbols are treated as primitives', () => {
    const symbol = Symbol(),
      obj = { foo: symbol }

    cloneDeep(obj).foo.should.equal(obj.foo)
  })

  //
  // Map and Set should be organized better but aint nobody got time fo dat!
  //
  test('Map', () => {
    const aMap = new Map([['foo', 'bar']])
    aMap.set(aMap, aMap)

    const cloneOfAMap = cloneDeep(aMap)
    cloneOfAMap.should.not.equal(aMap)
    cloneOfAMap.get('foo').should.equal('bar')
    cloneOfAMap.get(cloneOfAMap).should.equal(cloneOfAMap)
  })

  test('Set', () => {
    const aSet = new Set(['foo'])
    aSet.add('foo')
    aSet.add(aSet)

    const cloneOfASet = cloneDeep(aSet)
    cloneOfASet.should.not.equal(aSet)
    cloneOfASet.should.have.all.keys('foo', cloneOfASet)
  })

  test('only enumerable symbol properties', () => {
    const symbol1 = Symbol('the first symbol'),
      symbol2 = Symbol('the second symbol'),
      symbol3 = Symbol('the third symbol'),
      obj = {
        [symbol1]: 1,
        [symbol2]: 2,
        [symbol3]: 3,
      }

    Object.defineProperty(obj, symbol2, {
      enumerable: false,
    })

    const cloneOfObj = cloneDeep(obj)
    cloneOfObj.should.deep.equal({
      [symbol1]: 1,
      [symbol3]: 3,
    })
    cloneOfObj.should.not.have.own.property(symbol2)
  })

  test('should ignore non-enumerable own properties', () => {
    const obj = { x: 1 }
    Object.defineProperty(obj, 'y', { value: 2, enumerable: false })

    const cloneOfObj = cloneDeep(obj)
    cloneOfObj.should.deep.equal({ x: 1 })
    cloneOfObj.should.not.have.own.property('y')
  })
})
