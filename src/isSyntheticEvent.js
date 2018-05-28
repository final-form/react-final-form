// @flow
const isSyntheticEvent = (candidate: any): boolean =>
  !!(candidate && typeof candidate.stopPropagation === 'function')

export default isSyntheticEvent
