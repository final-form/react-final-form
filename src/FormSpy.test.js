import React from 'react'
import TestUtils from 'react-dom/test-utils'
import Form from './ReactFinalForm'
import Field from './Field'
import FormSpy from './FormSpy'

const onSubmitMock = () => {}
const hasFormApi = props => {
  expect(typeof props.batch).toBe('function')
  expect(typeof props.blur).toBe('function')
  expect(typeof props.change).toBe('function')
  expect(typeof props.focus).toBe('function')
  expect(typeof props.initialize).toBe('function')
  expect(typeof props.reset).toBe('function')
}

describe('FormSpy', () => {
  it('should warn error if not used inside a form', () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    TestUtils.renderIntoDocument(<FormSpy render={() => <div />} />)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: FormSpy must be used inside of a ReactFinalForm component'
    )
    spy.mockRestore()
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
    hasFormApi(render.mock.calls[0][0])
    expect(render.mock.calls[0][0].dirty).toBe(false)
    expect(render.mock.calls[0][0].errors).toEqual({})
    expect(render.mock.calls[0][0].invalid).toBe(false)
    expect(render.mock.calls[0][0].pristine).toBe(true)
    expect(render.mock.calls[0][0].submitFailed).toBe(false)
    expect(render.mock.calls[0][0].submitSucceeded).toBe(false)
    expect(render.mock.calls[0][0].submitting).toBe(false)
    expect(render.mock.calls[0][0].valid).toBe(true)
    expect(render.mock.calls[0][0].validating).toBe(false)
    expect(render.mock.calls[0][0].values).toEqual({})
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)

    // change value
    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(render).toHaveBeenCalledTimes(3)
    hasFormApi(render.mock.calls[2][0])
    expect(render.mock.calls[2][0].dirty).toBe(true)
    expect(render.mock.calls[2][0].errors).toEqual({})
    expect(render.mock.calls[2][0].invalid).toBe(false)
    expect(render.mock.calls[2][0].pristine).toBe(false)
    expect(render.mock.calls[2][0].submitFailed).toBe(false)
    expect(render.mock.calls[2][0].submitSucceeded).toBe(false)
    expect(render.mock.calls[2][0].submitting).toBe(false)
    expect(render.mock.calls[2][0].valid).toBe(true)
    expect(render.mock.calls[2][0].validating).toBe(false)
    expect(render.mock.calls[2][0].values).toEqual({ foo: 'bar' })
    expect(renderInput).toHaveBeenCalledTimes(3)
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
    hasFormApi(render.mock.calls[0][0])
    expect(render.mock.calls[0][0].dirty).toBeUndefined()
    expect(render.mock.calls[0][0].errors).toBeUndefined()
    expect(render.mock.calls[0][0].invalid).toBeUndefined()
    expect(render.mock.calls[0][0].pristine).toBe(true)
    expect(render.mock.calls[0][0].submitFailed).toBeUndefined()
    expect(render.mock.calls[0][0].submitSucceeded).toBeUndefined()
    expect(render.mock.calls[0][0].submitting).toBeUndefined()
    expect(render.mock.calls[0][0].valid).toBeUndefined()
    expect(render.mock.calls[0][0].validating).toBeUndefined()
    expect(render.mock.calls[0][0].values).toEqual({
      dog: 'Odie',
      cat: 'Garfield'
    })

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    // one for new prop, and again after reregistering
    expect(render).toHaveBeenCalledTimes(3)
    hasFormApi(render.mock.calls[2][0])
    expect(render.mock.calls[2][0].dirty).toBe(false)
    expect(render.mock.calls[2][0].errors).toBeUndefined()
    expect(render.mock.calls[2][0].invalid).toBeUndefined()
    expect(render.mock.calls[2][0].pristine).toBeUndefined()
    expect(render.mock.calls[2][0].submitFailed).toBeUndefined()
    expect(render.mock.calls[2][0].submitSucceeded).toBeUndefined()
    expect(render.mock.calls[2][0].submitting).toBe(false)
    expect(render.mock.calls[2][0].valid).toBeUndefined()
    expect(render.mock.calls[2][0].validating).toBeUndefined()
    expect(render.mock.calls[2][0].values).toBeUndefined()
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
    hasFormApi(render.mock.calls[0][0])
    expect(render.mock.calls[0][0].dirty).toBe(false)
    expect(render.mock.calls[0][0].errors).toBeUndefined()
    expect(render.mock.calls[0][0].invalid).toBeUndefined()
    expect(render.mock.calls[0][0].pristine).toBeUndefined()
    expect(render.mock.calls[0][0].submitFailed).toBeUndefined()
    expect(render.mock.calls[0][0].submitSucceeded).toBeUndefined()
    expect(render.mock.calls[0][0].submitting).toBeUndefined()
    expect(render.mock.calls[0][0].valid).toBeUndefined()
    expect(render.mock.calls[0][0].validating).toBeUndefined()
    expect(render.mock.calls[0][0].values).toEqual({})
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)

    // change value
    renderInput.mock.calls[0][0].input.onChange('bar')

    // once because whole form rerendered, and again because state changed
    expect(render).toHaveBeenCalledTimes(3)
    hasFormApi(render.mock.calls[2][0])
    expect(render.mock.calls[2][0].dirty).toBe(true)
    expect(render.mock.calls[2][0].errors).toBeUndefined()
    expect(render.mock.calls[2][0].invalid).toBeUndefined()
    expect(render.mock.calls[2][0].pristine).toBeUndefined()
    expect(render.mock.calls[2][0].submitFailed).toBeUndefined()
    expect(render.mock.calls[2][0].submitSucceeded).toBeUndefined()
    expect(render.mock.calls[2][0].submitting).toBeUndefined()
    expect(render.mock.calls[2][0].valid).toBeUndefined()
    expect(render.mock.calls[2][0].validating).toBeUndefined()
    expect(render.mock.calls[2][0].values).toEqual({ foo: 'bar' })
    expect(renderInput).toHaveBeenCalledTimes(3)
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
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    expect(render).not.toHaveBeenCalled()
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(render).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: FormSpy must be used inside of a ReactFinalForm component'
    )
    spy.mockRestore()
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

  it('should ignore SyntheticEvents on form reset ', () => {
    const input = jest.fn(({ input }) => <input {...input} />)
    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        subscription={{}}
        initialValues={{ foo: 'bar' }}
      >
        {() => (
          <form>
            <FormSpy subscription={{}}>
              {({ form }) => <button onClick={form.reset}>Reset</button>}
            </FormSpy>
            <Field name="foo" render={input} />
          </form>
        )}
      </Form>
    )
    expect(input).toHaveBeenCalled()
    expect(input).toHaveBeenCalledTimes(1)
    expect(input.mock.calls[0][0].input.value).toBe('bar')

    input.mock.calls[0][0].input.onChange('baz')

    expect(input).toHaveBeenCalledTimes(2)
    expect(input.mock.calls[1][0].input.value).toBe('baz')

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(input).toHaveBeenCalledTimes(3)
    expect(input.mock.calls[2][0].input.value).toBe('bar')
  })

  it('should accept new initial values on form reset ', () => {
    const input = jest.fn(({ input }) => <input {...input} />)
    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        subscription={{}}
        initialValues={{ foo: 'bar' }}
      >
        {() => (
          <form>
            <FormSpy subscription={{}}>
              {({ form }) => (
                <button onClick={() => form.reset({ foo: 'newfoo' })}>
                  Reset
                </button>
              )}
            </FormSpy>
            <Field name="foo" render={input} />
          </form>
        )}
      </Form>
    )
    expect(input).toHaveBeenCalled()
    expect(input).toHaveBeenCalledTimes(1)
    expect(input.mock.calls[0][0].input.value).toBe('bar')

    input.mock.calls[0][0].input.onChange('baz')

    expect(input).toHaveBeenCalledTimes(2)
    expect(input.mock.calls[1][0].input.value).toBe('baz')

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(input).toHaveBeenCalledTimes(3)
    expect(input.mock.calls[2][0].input.value).toBe('newfoo')
  })

  it('should call onChange', () => {
    const input = jest.fn(({ input }) => <input {...input} />)
    const onChange = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <FormSpy subscription={{ dirty: true }} onChange={onChange} />
            <Field name="foo" render={input} />
          </form>
        )}
      </Form>
    )
    expect(input).toHaveBeenCalled()
    expect(input).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ dirty: false })

    input.mock.calls[0][0].input.onChange('bar')

    expect(input).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith({ dirty: true })
  })

  it('should not render with render prop when given onChange', () => {
    const onChange = jest.fn()
    const render = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <FormSpy
              subscription={{ dirty: true }}
              onChange={onChange}
              render={render}
            />
          </form>
        )}
      </Form>
    )
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(render).not.toHaveBeenCalled()
  })

  it('should not render with child render prop when given onChange', () => {
    const onChange = jest.fn()
    const render = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <FormSpy subscription={{ dirty: true }} onChange={onChange}>
              {render}
            </FormSpy>
          </form>
        )}
      </Form>
    )
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(render).not.toHaveBeenCalled()
  })

  it('should not render with component prop when given onChange', () => {
    const onChange = jest.fn()
    const render = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <FormSpy
              subscription={{ dirty: true }}
              onChange={onChange}
              component={render}
            />
          </form>
        )}
      </Form>
    )
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(render).not.toHaveBeenCalled()
  })

  const deprecatedFns = {
    // map from name to args
    batch: [() => {}],
    blur: ['foo'],
    change: ['foo', 'bar'],
    focus: [],
    initialize: [{ foo: 'bar' }],
    reset: []
  }

  Object.keys(deprecatedFns).forEach(key => {
    it(`should warn if deprecated function props.${key}() is called`, async () => {
      const spy = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => {})
      const dom = TestUtils.renderIntoDocument(
        <Form onSubmit={onSubmitMock}>
          {() => (
            <FormSpy>
              {props => (
                <button
                  onClick={() => {
                    expect(spy).not.toHaveBeenCalled()
                    props[key](...deprecatedFns[key])
                    expect(spy).toHaveBeenCalled()
                    expect(spy).toHaveBeenCalledTimes(1)
                    expect(spy).toHaveBeenCalledWith(
                      `Warning: As of React Final Form v3.3.0, props.${key}() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.${key}() instead. Check your FormSpy render prop.`
                    )
                  }}
                >
                  Click me, Alice!
                </button>
              )}
            </FormSpy>
          )}
        </Form>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)
      spy.mockRestore()
    })
  })

  it(`should warn if deprecated function props.mutators.whatever() is called`, async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const mutator = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} mutators={{ whatever: mutator }}>
        {() => (
          <FormSpy>
            {props => {
              expect(spy).not.toHaveBeenCalled()
              expect(mutator).not.toHaveBeenCalled()
              props.mutators.whatever()
              expect(mutator).toHaveBeenCalled()
              expect(mutator).toHaveBeenCalledTimes(1)
              expect(spy).toHaveBeenCalled()
              expect(spy).toHaveBeenCalledTimes(1)
              expect(spy).toHaveBeenCalledWith(
                `Warning: As of React Final Form v3.3.0, props.mutators is deprecated and will be removed in the next major version of React Final Form. Use: props.form.mutators instead. Check your FormSpy render prop.`
              )
              return <div />
            }}
          </FormSpy>
        )}
      </Form>
    )
    spy.mockRestore()
  })
})
