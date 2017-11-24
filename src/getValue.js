// @flow
const getSelectedValues = options => {
  const result = []
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index]
      if (option.selected) {
        result.push(option.value)
      }
    }
  }
  return result
}

const getValue = (event: SyntheticInputEvent<*>, isReactNative: boolean) => {
  if (
    !isReactNative &&
    event.nativeEvent &&
    event.nativeEvent.text !== undefined
  ) {
    return event.nativeEvent.text
  }
  if (isReactNative && event.nativeEvent) {
    return (event.nativeEvent: any).text
  }
  const detypedEvent: any = event
  const { target: { type, value, checked } } = detypedEvent
  switch (type) {
    case 'checkbox':
      return !!checked
    case 'select-multiple':
      return getSelectedValues((event.target: any).options)
    default:
      return value
  }
}

export default getValue
