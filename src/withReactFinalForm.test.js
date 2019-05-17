import React from 'react'
import { render, cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'
import Form from './ReactFinalForm'
import withReactFinalForm from './withReactFinalForm'

const onSubmitMock = values => {}

describe('withReactFinalForm', () => {
  afterEach(cleanup)

  it('should pass in form', () => {
    const MyFormConsumer = withReactFinalForm(({ reactFinalForm: form }) => {
      expect(form).toBeDefined()
      expect(typeof form.change).toBe('function')
      expect(typeof form.reset).toBe('function')
      return (
        <div data-testid="formCheck">{form ? 'Got a form!' : 'No form!'}</div>
      )
    })
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>{() => <MyFormConsumer />}</Form>
    )
    expect(getByTestId('formCheck')).toHaveTextContent('Got a form!')
  })

  it('should provide a meaningful component name', () => {
    class MyFormConsumer extends React.Component {
      render() {
        return <div>MyFormConsumer</div>
      }
    }
    const Component = withReactFinalForm(MyFormConsumer)
    expect(Component.displayName).toBe('ReactFinalForm(MyFormConsumer)')
  })
})
