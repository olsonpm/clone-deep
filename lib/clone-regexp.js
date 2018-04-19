//------//
// Init //
//------//

const flagNameToLetter = getFlagNameToLetter()

//
//------//
// Main //
//------//

const cloneRegexp = aRegexp => {
  const flagNames = Object.keys(flagNameToLetter),
    regexpHasTruthyFlagName = getValueFrom(aRegexp),
    toLetter = getValueFrom(flagNameToLetter)

  const regexpFlags = flagNames
    .filter(regexpHasTruthyFlagName)
    .map(toLetter)
    .join('')

  const clonedRegexp = new RegExp(aRegexp.source, regexpFlags)
  clonedRegexp.lastIndex = aRegexp.lastIndex

  return clonedRegexp
}

//
//------------------//
// Helper Functions //
//------------------//

function getValueFrom(anObject) {
  return key => anObject[key]
}

function getFlagNameToLetter() {
  return {
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y',
    unicode: 'u',
  }
}

//
//---------//
// Exports //
//---------//

module.exports = cloneRegexp
