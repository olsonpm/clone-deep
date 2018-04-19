'use strict'

//
// README
//   - Javascript makes cloning very awkward and the code organization reflects
//     that.  Still, it is organized the way it is with good reason so please
//     ask if you have any questions about teh codez.
//

//---------//
// Imports //
//---------//

const cloneRegexp = require('./clone-regexp'),
  typeDetect = require('type-detect')

//
//------//
// Init //
//------//

const originalTypeToCreateClone = getOriginalTypeToCreateClone(),
  setOfTypesUnableToBeCloned = new Set(['Error', 'Promise'])

//
//------//
// Main //
//------//

const cloneDeep = rootOriginal => {
  //
  // `references` holds a map of objects where the key is the object found in
  //   original structure and the value is the cloned object.  This allows the
  //   recursive function to keep references in tact
  //
  const references = new Map()
  return recursiveCloneDeep(rootOriginal)

  function recursiveCloneDeep(original) {
    //
    // just return the original value if it's not cloneable
    //
    // * this module uses 'type' to mean 'type as determined by type-detect'.
    //   'RawType' is my term for referring to the result of `typeof`
    //
    const originalRawType = typeof original
    if (original !== null && originalRawType !== 'object') {
      return original
    }
    const originalType = typeDetect(original)
    if (setOfTypesUnableToBeCloned.has(originalType)) {
      return original
    }

    //
    // if it's a reference to a previously cloned value, then return that
    //
    const previouslyClonedValue = references.get(original)
    if (previouslyClonedValue) return previouslyClonedValue

    //
    // otherwise clone on!
    //
    const createClone = originalTypeToCreateClone[originalType] || cloneObject

    const clone = passThrough(original, [
      createClone,
      assignReference,
      handleMapAndSet,
      maybeCloneOwnEnumerableProps,
      cloneOwnPropertySymbols,
    ])
    references.set(original, clone)

    return clone

    // helper functions scoped to 'recursiveCloneDeep'

    function assignReference(clone) {
      references.set(original, clone)
      return clone
    }

    function maybeCloneOwnEnumerableProps(clone) {
      if (originalType === 'Buffer') return clone

      for (const key of Object.keys(original)) {
        clone[key] = recursiveCloneDeep(original[key])
      }

      return clone
    }

    function cloneOwnPropertySymbols(clone) {
      for (const aSymbol of Object.getOwnPropertySymbols(original)) {
        const propertyValue = original[aSymbol],
          descriptor = Reflect.getOwnPropertyDescriptor(original, aSymbol)

        if (!descriptor.enumerable) {
          continue
        }

        clone[aSymbol] = recursiveCloneDeep(propertyValue)
      }

      return clone
    }

    //
    // ideally javascript would provide apis to create a base reference for any
    //   object and allow us to mutate it to match another object later.
    //   Constructs such as Regex don't allow this however so we're left with code
    //   that awkwardly creates a base reference for some objects but not others.
    //   This method is a result of that awkwardness.
    //
    function handleMapAndSet(clone) {
      if (originalType === 'Map') return cloneMap(clone)
      else if (originalType === 'Set') return cloneSet(clone)
      else return clone
    }

    function cloneMap(clone) {
      for (const [key, value] of original) {
        const cloneKey = recursiveCloneDeep(key),
          cloneValue = recursiveCloneDeep(value)
        clone.set(cloneKey, cloneValue)
      }
      return clone
    }

    function cloneSet(clone) {
      for (const value of original) {
        clone.add(recursiveCloneDeep(value))
      }
      return clone
    }
  }
}

//
//------------------//
// Helper Functions //
//------------------//

function passThrough(arg, functionArray) {
  return functionArray.reduce((result, aFunction) => aFunction(result), arg)
}

function cloneObject(anObject) {
  const proto = Object.getPrototypeOf(anObject)
  return Object.create(proto)
}

function returnArguments() {
  return arguments
}

function getOriginalTypeToCreateClone() {
  return {
    Arguments: cloneArguments,
    Array: () => [],
    Buffer: aBuffer => Buffer.from(aBuffer),
    Date: original => new Date(original.getTime()),
    Map: () => new Map(),
    RegExp: cloneRegexp,
    Set: () => new Set(),
  }
}

function cloneArguments(args) {
  // the contents will be deep cloned via `maybeCloneOwnEnumerableProps`
  const cloneOfArgs = returnArguments()
  cloneOfArgs.length = args.length
  return cloneOfArgs
}

//
//---------//
// Exports //
//---------//

module.exports = cloneDeep
