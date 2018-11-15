import React from 'react'
import TestUtils from 'react-dom/test-utils'

import Form from './ReactFinalForm'
import { getDisplayName, withReactFinalForm } from './reactFinalFormContext'

describe('reactFinalFormContext', () => {
  describe('getDisplayName', () => {
    it('return displayName for Wrapped component with displayName', () => {
      const Component = { displayName: 'Field' }

      expect(getDisplayName(Component)).toEqual('ReactFinalForm(Field)')
    })

    it('return displayName for Wrapped component with name', () => {
      const Component = { name: 'Field' }

      expect(getDisplayName(Component)).toEqual('ReactFinalForm(Field)')
    })

    it('return FinalForm(Component) by default', () => {
      expect(getDisplayName({})).toEqual('ReactFinalForm(Component)')
    })
  })

  it('should pass formApi using HOC', () => {
    const mockComponent = jest.fn(() => <div />)
    const render = () => {
      const BoundComponent = withReactFinalForm(mockComponent)
      return <BoundComponent />
    }
    const formComponent = TestUtils.renderIntoDocument(
      <Form onSubmit={() => {}} render={render} />
    )
    expect(mockComponent).toHaveBeenCalled()
    expect(mockComponent.mock.calls[0][0].reactFinalForm).toBe(
      formComponent.form
    )
  })
})
