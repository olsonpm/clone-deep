'use strict'

const chai = require('chai'),
  cloneDeep = require('../../lib')

chai.should()

//
// nothing substantial to test here
//

suite('primitives', () => {
  test('string', () => {
    cloneDeep('sheep').should.equal('sheep')
  })
  test('number', () => {
    cloneDeep(1).should.equal(1)
  })
})
