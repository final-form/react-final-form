// @flow
export default function<Subscription: { [string]: boolean }>(
  a: ?Subscription,
  b: ?Subscription,
  keys: string[]
): boolean {
  if (a) {
    if (b) {
      // $FlowFixMe
      return keys.some(key => a[key] !== b[key])
    } else {
      return true
    }
  } else {
    return !!b
  }
}
