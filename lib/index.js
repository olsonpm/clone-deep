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

const getTypeToDeepCloneData = require('./get-type-to-deep-clone-data'),
  typeDetect = require('type-detect')

//
//------//
// Init //
//------//

const typeToCreateCloneReference = getTypeToCreateCloneReference(),
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
  const references = new Map(),
    typeToDeepCloneData = getTypeToDeepCloneData(recursiveCloneDeep)

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
    const createCloneReference =
      typeToCreateCloneReference[originalType] || createInitialObject

    return passThrough(original, [
      createCloneReference,
      assignReference,
      performDeepClone,
    ])

    // helper functions scoped to 'recursiveCloneDeep'

    function performDeepClone(cloneReference) {
      const deepCloneData =
        typeToDeepCloneData[originalType] || deepCloneOwnEnumerableProps

      return deepCloneData(original, cloneReference)
    }

    function assignReference(clone) {
      references.set(original, clone)
      return clone
    }

    function deepCloneOwnEnumerableProps(original, cloneReference) {
      for (const key of Object.keys(original)) {
        cloneReference[key] = recursiveCloneDeep(original[key])
      }
      return cloneReference
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

function createInitialObject(anObject) {
  const proto = Object.getPrototypeOf(anObject)
  return Object.create(proto)
}

function cloneRegExp(aRegexp) {
  const clonedRegexp = new RegExp(aRegexp.source, aRegexp.flags)
  clonedRegexp.lastIndex = aRegexp.lastIndex
  return clonedRegexp
}

function returnArguments() {
  return arguments
}

//
// The 'typeTo...' structures could be lumped together.  They're simple enough
//   apart though and there's less indentation so I'm keeping it this way
//   for now.
//
function getTypeToCreateCloneReference() {
  return {
    Arguments: () => returnArguments(),
    Array: () => [],
    Buffer: aBuffer => Buffer.allocUnsafe(aBuffer.length),
    Date: () => new Date(),
    Map: () => new Map(),
    Set: () => new Set(),

    //
    // we can't mutate a RegExp instance later so we have to clone it in
    //   full here
    //
    RegExp: cloneRegExp,
  }
}

//
//---------//
// Exports //
//---------//

module.exports = cloneDeep
