// @flow
const shallowEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true
  }
  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
    return false
  }
  var keysA = Object.keys(a)
  var keysB = Object.keys(b)
  if (keysA.length !== keysB.length) {
    return false
  }
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b)
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx]
    if (!bHasOwnProperty(key) || a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export default shallowEqual
