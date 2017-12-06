import React from 'react'
import TestUtils from 'react-dom/test-utils'
import Form from './ReactFinalForm'
import Field from './Field'
import FormSpy from './FormSpy'

const onSubmitMock = values => {}

describe('FormSpy', () => {
  it('should warn error if not used inside a form', () => {
    TestUtils.renderIntoDocument(<FormSpy render={() => <div />} />)
  })

  it('should allow subscribing to everything', () => {
    const render = jest.fn(() => <div />)
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <FormSpy render={render} />
            <Field name="foo" render={renderInput} />
          </form>
        )}
      </Form>
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render).toHaveBeenCalledWith({
      dirty: false,
      errors: {},
      invalid: false,
      pristine: true,
      submitFailed: false,
      submitSucceeded: false,
      submitting: false,
      valid: true,
      validating: false,
      values: {}
    })
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)

    // change value
    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(render).toHaveBeenCalledTimes(2)
    expect(render).toHaveBeenCalledWith({
      dirty: true,
      errors: {},
      invalid: false,
      pristine: false,
      submitFailed: false,
      submitSucceeded: false,
      submitting: false,
      valid: true,
      validating: false,
      values: { foo: 'bar' }
    })
    expect(renderInput).toHaveBeenCalledTimes(2)
  })

  it('should resubscribe if subscription changes', () => {
    const render = jest.fn(() => <div />)
    class Container extends React.Component {
      state = { subscription: { values: true, pristine: true } }

      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{ dog: 'Odie', cat: 'Garfield' }}
          >
            {() => (
              <form>
                <FormSpy {...this.state}>{render}</FormSpy>
                <button
                  type="button"
                  onClick={() =>
                    this.setState({
                      subscription: { dirty: true, submitting: true }
                    })
                  }
                >
                  Switch
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    expect(render).not.toHaveBeenCalled()
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render).toHaveBeenCalledWith({
      values: { dog: 'Odie', cat: 'Garfield' },
      pristine: true
    })

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(render).toHaveBeenCalledTimes(2)
    expect(render).toHaveBeenCalledWith({ dirty: false, submitting: false })
  })

  it('should hear changes', () => {
    const render = jest.fn(() => <div />)
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <FormSpy
              subscription={{ dirty: true, values: true }}
              render={render}
            />
            <Field name="foo" render={renderInput} />
          </form>
        )}
      </Form>
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render).toHaveBeenCalledWith({
      values: {},
      dirty: false
    })
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)

    // change value
    renderInput.mock.calls[0][0].input.onChange('bar')

    // once because whole form rerendered, and again because state changed
    expect(render).toHaveBeenCalledTimes(3)
    expect(render).toHaveBeenCalledWith({
      values: { foo: 'bar' },
      dirty: true
    })
    expect(renderInput).toHaveBeenCalledTimes(2)
  })

  it('should not unsubscribe/resubscribe if not in form', () => {
    // this is mainly for code coverage

    const render = jest.fn(() => <div />)
    class Container extends React.Component {
      state = { subscription: { dirty: true } }

      render() {
        return (
          <div>
            <FormSpy {...this.state} render={render} />
            <button
              type="button"
              onClick={() => this.setState({ subscription: { valid: true } })}
            >
              Switch
            </button>
          </div>
        )
      }
    }
    expect(render).not.toHaveBeenCalled()
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(render).toHaveBeenCalledTimes(2)
  })

  it('should unsubscribe on unmount', () => {
    // This is mainly here for code coverage. 🧐
    class Container extends React.Component {
      state = { shown: true }

      render() {
        return (
          <Form onSubmit={onSubmitMock}>
            {() => (
              <form>
                {this.state.shown && <FormSpy render={() => <div />} />}
                <button
                  type="button"
                  onClick={() => this.setState({ shown: false })}
                >
                  Unmount
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)
  })
})
