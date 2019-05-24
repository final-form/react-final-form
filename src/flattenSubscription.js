// @flow
type Subscription = { [string]: boolean }
export default function flattenSubscription(
  subscription: Subscription = {}
): string {
  return Object.keys(subscription)
    .filter(key => subscription[key] === true)
    .map(key => key)
    .sort()
    .join(',')
}
