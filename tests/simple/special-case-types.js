'use strict'

//---------//
// Imports //
//---------//

const chai = require('chai'),
  cloneDeep = require('../../lib')

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
// special case types: couldn't think of a good name for these, but there should
//   be one test for each type found in 'create-original-type-to-create-clone'
//
// should each contain three tests
//   1. deep equality
//   2. clone doesn't reference original
//   3. mutated clone should not deep equal original
//

suite('special case types', () => {
  test('arguments', () => {
    const args = returnArguments('a', 'b'),
      cloneOfArgs = cloneDeep(args)

    cloneOfArgs.should.deep.equal(args)
    cloneOfArgs.should.not.equal(args)

    cloneOfArgs[0] = 'c'
    cloneOfArgs.should.not.deep.equal(args)
  })

  test('array', () => {
    const pizzaToppings = ['pepperoni', 'mushroom'],
      cloneOfPizzaToppings = cloneDeep(pizzaToppings)

    cloneOfPizzaToppings.should.deep.equal(pizzaToppings)
    cloneOfPizzaToppings.should.not.equal(pizzaToppings)

    cloneOfPizzaToppings.pop()
    cloneOfPizzaToppings.should.not.deep.equal(pizzaToppings)
  })

  test('buffer', () => {
    const aBuffer = Buffer.alloc(1, 'a'),
      cloneOfABuffer = cloneDeep(aBuffer)

    cloneOfABuffer.should.deep.equal(aBuffer)
    cloneOfABuffer.should.not.equal(aBuffer)

    cloneOfABuffer[0] = 0x62 // 0x62 is the ascii hex for 'b'
    cloneOfABuffer.should.not.deep.equal(aBuffer)
  })

  test('date', () => {
    const today = new Date(),
      cloneOfToday = cloneDeep(today)

    cloneOfToday.should.deep.equal(today)
    cloneOfToday.should.not.equal(today)

    cloneOfToday.setDate(cloneOfToday.getDate() + 1)
    cloneOfToday.getTime().should.not.deep.equal(today)
  })

  test('map', () => {
    const favoriteFilm = new Map([['max', 'A Nightmare on Elm Street']]),
      cloneOfFavoriteFilm = cloneDeep(favoriteFilm)

    cloneOfFavoriteFilm.should.deep.equal(favoriteFilm)
    cloneOfFavoriteFilm.should.not.equal(favoriteFilm)

    cloneOfFavoriteFilm.set('max', 'Mad Max')
    cloneOfFavoriteFilm.should.not.deep.equal(favoriteFilm)
  })

  test('object', () => {
    const max = {
      address: {
        street: '1428 Elm Street',
      },
    }

    const cloneOfMax = cloneDeep(max)

    cloneOfMax.should.deep.equal(max)
    cloneOfMax.should.not.equal(max)

    cloneOfMax.address.street = 'Fury Road'
    cloneOfMax.should.not.deep.equal(max)
  })

  test('regexp', () => {
    const duckRe = /duck/g,
      cloneOfDuckRe = cloneDeep(duckRe)

    cloneOfDuckRe.should.deep.equal(duckRe)
    cloneOfDuckRe.should.not.equal(duckRe)

    cloneOfDuckRe.test('duck duck goose')
    cloneOfDuckRe.should.not.deep.equal(duckRe)
  })

  test('set', () => {
    const setOfKeys = new Set(['home', 'car']),
      clonedSetOfKeys = cloneDeep(setOfKeys)

    clonedSetOfKeys.should.deep.equal(setOfKeys)
    clonedSetOfKeys.should.not.equal(setOfKeys)

    clonedSetOfKeys.add('office')
    clonedSetOfKeys.should.not.deep.equal(setOfKeys)
  })
})

//
//------------------//
// Helper Functions //
//------------------//

function returnArguments() {
  return arguments
}
