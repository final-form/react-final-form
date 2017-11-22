// @flow
const warning =
  process.env.NODE_ENV === 'production'
    ? /* istanbul ignore next */
      (condition: any, message: string) => {}
    : (condition: any, message: string): void => {
        if (!condition) {
          console.error(`Warning: ${message}`)
        }
      }

export default warning
