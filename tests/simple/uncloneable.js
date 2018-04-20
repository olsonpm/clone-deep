'use strict'

const chai = require('chai'),
  cloneDeep = require('../../lib')

chai.should()

//
// unlike primitives, these are types recognizable by type-detect which cannot
//   be cloned without weird and hopefully unnecessary hacks.  Each test below
//   should have a corresponding type in index.js -> setOfTypesUnableToBeCloned
//
// * this module is a first draft.  I still have to use this implementation to
//   understand the use-cases
//

suite('uncloneable', () => {
  test('error', () => {
    const anError = new Error()
    cloneDeep(anError).should.equal(anError)
  })
  test('promise', () => {
    const aPromise = Promise.resolve()
    cloneDeep(aPromise).should.equal(aPromise)
  })
})
