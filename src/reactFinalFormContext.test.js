import React from 'react'
import TestUtils from 'react-dom/test-utils'

import Form from './ReactFinalForm'
import { withReactFinalForm } from './reactFinalFormContext'

describe('reactFinalFormContext', () => {
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
