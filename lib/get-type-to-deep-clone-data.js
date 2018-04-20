//------//
// Main //
//------//

const getTypeToDeepCloneData = recursiveCloneDeep => {
  return {
    Arguments: cloneArrayLike,
    Array: cloneArrayLike,
    Buffer: cloneBuffer,
    Date: cloneDate,
    Map: deepCloneMap,
    Set: deepCloneSet,
    RegExp: (_unusedOriginal, clonedRegExp) => clonedRegExp,
  }

  // scoped helper functions

  function cloneArrayLike(original, cloneReference) {
    cloneReference.length = original.length
    for (let i = 0; i < original.length; i += 1) {
      cloneReference[i] = recursiveCloneDeep(original[i])
    }
    return cloneReference
  }

  function cloneBuffer(original, cloneReference) {
    original.copy(cloneReference)
    return cloneReference
  }

  function cloneDate(original, cloneReference) {
    cloneReference.setTime(original.getTime())
    return cloneReference
  }

  function deepCloneMap(original, cloneReference) {
    for (const [key, value] of original) {
      const cloneKey = recursiveCloneDeep(key),
        cloneValue = recursiveCloneDeep(value)
      cloneReference.set(cloneKey, cloneValue)
    }
    return cloneReference
  }

  function deepCloneSet(original, cloneReference) {
    for (const value of original) {
      cloneReference.add(recursiveCloneDeep(value))
    }
    return cloneReference
  }
}

//
//---------//
// Exports //
//---------//

module.exports = getTypeToDeepCloneData
