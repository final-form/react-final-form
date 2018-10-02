import React from 'react'
import ReactDOMServer from 'react-dom/server'
import TestUtils from 'react-dom/test-utils'
import Form from './ReactFinalForm'
import Field from './Field'
import deepEqual from 'fast-deep-equal'

const onSubmitMock = values => {}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('ReactFinalForm', () => {
  it('should render with render function', () => {
    const render = jest.fn(() => <div />)
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('should render with children render function', () => {
    const render = jest.fn(() => <div />)
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(<Form onSubmit={onSubmitMock}>{render}</Form>)
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('should print a warning with no render or children specified', () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    TestUtils.renderIntoDocument(<Form onSubmit={onSubmitMock} />)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: Must specify either a render prop, a render function as children, or a component prop to ReactFinalForm'
    )
    spy.mockRestore()
  })

  it('should print a warning with no onSubmit specified', () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const render = jest.fn(() => <div />)
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(<Form render={render} />)
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('Warning: No onSubmit function specified')
    spy.mockRestore()
  })

  it('should allow render to be a component', () => {
    const renderSpy = jest.fn(() => <div />)
    class RenderComponent extends React.Component {
      render() {
        return renderSpy()
      }
    }
    expect(renderSpy).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} component={RenderComponent} />
    )
    expect(renderSpy).toHaveBeenCalled()
    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('should unsubscribe on unmount', () => {
    // This is mainly here for code coverage. 🧐
    class Container extends React.Component {
      state = { shown: true }
      render() {
        return (
          <div>
            {this.state.shown && (
              <Form onSubmit={onSubmitMock} render={() => <form />} />
            )}
            <button
              type="button"
              onClick={() => this.setState({ shown: false })}
            >
              Unmount
            </button>
          </div>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)
  })
  it('should render with a field', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" component={renderInput} />
      </form>
    ))
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].dirty).toEqual(false)
    expect(typeof render.mock.calls[0][0].handleSubmit).toBe('function')
    expect(render.mock.calls[0][0].invalid).toEqual(false)
    expect(render.mock.calls[0][0].pristine).toEqual(true)
    expect(render.mock.calls[0][0].submitFailed).toEqual(false)
    expect(render.mock.calls[0][0].submitSucceeded).toEqual(false)
    expect(render.mock.calls[0][0].submitting).toEqual(false)
    expect(render.mock.calls[0][0].valid).toEqual(true)
    expect(render.mock.calls[0][0].validating).toEqual(false)
    expect(render.mock.calls[0][0].values).toEqual({})
  })
  it('should render with a field with a limited subscription', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} />
      </form>
    ))
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={render}
        subscription={{ values: true }}
      />
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(typeof render.mock.calls[0][0].handleSubmit).toBe('function')
    expect(render.mock.calls[0][0].values).toEqual({})
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
  })
  it('should update dirty flag when form is dirty', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} />
      </form>
    ))
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={render}
        subscription={{ dirty: true }}
      />
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].dirty).toBe(false)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    const change = renderInput.mock.calls[0][0].input.onChange
    change('bar')
    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[1][0].dirty).toBe(true)
  })
  it('should call onSubmit when form is submitted', () => {
    const onSubmit = jest.fn()
    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmit}
        subscription={{ dirty: true }}
        initialValues={{ foo: 'bar' }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="foo" component="input" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(onSubmit).not.toHaveBeenCalled()
    const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')
    TestUtils.Simulate.submit(form)
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ foo: 'bar' })
  })
  it('should not throw when handleSubmit is called with no event', () => {
    const onSubmit = jest.fn()
    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form
            onSubmit={() => {
              handleSubmit()
            }}
          >
            <Field name="foo" component="input" />
          </form>
        )}
      </Form>
    )
    const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')
    TestUtils.Simulate.submit(form)
    expect(onSubmit).toHaveBeenCalled()
  })
  it('does not throw if handleSubmit event preventDefault or stopPropagation are not functions', () => {
    const onSubmit = jest.fn()
    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form
            onSubmit={() => {
              handleSubmit({
                preventDefault: undefined,
                stopPropagation: undefined
              })
            }}
          >
            <Field name="foo" component="input" />
          </form>
        )}
      </Form>
    )
    const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')
    TestUtils.Simulate.submit(form)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should reinitialize when initialValues prop changes', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    class Container extends React.Component {
      state = { initValues: {} }
      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            subscription={{ dirty: true }}
            initialValues={this.state.initValues}
          >
            {() => (
              <form>
                <Field name="foo" render={renderInput} />
                <button
                  type="button"
                  onClick={() => this.setState({ initValues: { foo: 'bar' } })}
                >
                  Initialize
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    const init = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(init)

    // once to change prop and again after reinitialization
    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[2][0].input.value).toBe('bar')
  })

  it('should reinitialize when initialValues prop changes, deeply', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    class Container extends React.Component {
      state = { initValues: { foo: { bar: 'baz' } } }
      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            subscription={{ dirty: true }}
            initialValues={this.state.initValues}
          >
            {() => (
              <form>
                <Field name="foo.bar" render={renderInput} />
                <button
                  type="button"
                  onClick={() =>
                    this.setState({ initValues: { foo: { bar: 'baq' } } })
                  }
                >
                  Initialize
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    const init = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(init)

    // once to change prop and again after reinitialization
    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[2][0].input.value).toBe('baq')
  })

  it('should not reinitialize if initialValues prop is deep equal', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const lastRenderInputCall = () =>
      renderInput.mock.calls[renderInput.mock.calls.length - 1]
    class Container extends React.Component {
      state = { initValues: { foo: { bar: 'baz' } } }
      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            subscription={{ dirty: true }}
            initialValues={this.state.initValues}
            initialValuesEqual={deepEqual}
          >
            {() => (
              <form>
                <Field name="foo.bar" render={renderInput} />
                <button
                  type="button"
                  onClick={() =>
                    this.setState({ initValues: { foo: { bar: 'baz' } } })
                  }
                >
                  Initialize
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    lastRenderInputCall()[0].input.onChange('bar!')
    expect(lastRenderInputCall()[0].input.value).toBe('bar!')
    const init = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(init)

    // field should still be edited
    const numCalls = renderInput.mock.calls.length
    expect(renderInput.mock.calls[numCalls - 1][0].input.value).toBe('bar!')
  })

  it('should respect keepDirtyOnReinitialize prop when initialValues prop changes', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    class Container extends React.Component {
      state = { initValues: { foo: 'bar' } }
      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            subscription={{ dirty: true }}
            keepDirtyOnReinitialize={true}
            initialValues={this.state.initValues}
          >
            {() => (
              <form>
                <Field name="foo" render={renderInput} />
                <button
                  type="button"
                  onClick={() => this.setState({ initValues: { foo: 'bar' } })}
                >
                  Initialize
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
    TestUtils.Simulate.change(input, { target: { value: 'baz' } })
    expect(renderInput).toHaveBeenCalledTimes(2)
    const init = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(init)
    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[1][0].input.value).toBe('baz')
  })
  it('should update when onSubmit changes', async () => {
    const oldOnSubmit = jest.fn()
    const newOnSubmit = jest.fn()
    class Container extends React.Component {
      state = { submit: oldOnSubmit }
      render() {
        return (
          <Form onSubmit={this.state.submit} subscription={{ dirty: true }}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  onClick={() => this.setState({ submit: newOnSubmit })}
                >
                  Update
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')
    TestUtils.Simulate.submit(form)
    expect(oldOnSubmit).toHaveBeenCalled()
    expect(oldOnSubmit).toHaveBeenCalledTimes(1)
    expect(newOnSubmit).not.toHaveBeenCalled()
    const update = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(update)
    TestUtils.Simulate.submit(form)
    expect(oldOnSubmit).toHaveBeenCalledTimes(1)
    expect(newOnSubmit).toHaveBeenCalled()
    expect(newOnSubmit).toHaveBeenCalledTimes(1)
  })
  it('should warn if decorators change', async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const decoratorA = form => form
    const decoratorB = form => form
    const decoratorC = form => form
    const oldDecorators = [decoratorA, decoratorB]
    const newDecorators = [decoratorA, decoratorB, decoratorC]
    class Container extends React.Component {
      state = { decorators: oldDecorators }
      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            subscription={{ dirty: true }}
            decorators={this.state.decorators}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  onClick={() => this.setState({ decorators: newDecorators })}
                >
                  Update
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(spy).not.toHaveBeenCalled()
    const update = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(update)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: Form decorators should not change from one render to the next as new values will be ignored'
    )
    spy.mockRestore()
  })
  it('should warn if subscription changes', async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const oldSubscription = { values: true, valid: true }
    const newSubscription = { values: true, invalid: true, dirty: true }
    class Container extends React.Component {
      state = { subscription: oldSubscription }
      render() {
        return (
          <Form onSubmit={onSubmitMock} subscription={this.state.subscription}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  onClick={() =>
                    this.setState({ subscription: newSubscription })
                  }
                >
                  Update
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(spy).not.toHaveBeenCalled()
    const update = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(update)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: Form subscription should not change from one render to the next as new values will be ignored'
    )
    spy.mockRestore()
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
      TestUtils.renderIntoDocument(
        <Form onSubmit={onSubmitMock}>
          {props => {
            expect(spy).not.toHaveBeenCalled()
            props[key](...deprecatedFns[key])
            expect(spy).toHaveBeenCalled()
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
              `Warning: As of React Final Form v3.3.0, props.${key}() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.${key}() instead. Check your ReactFinalForm render prop.`
            )
            return <div />
          }}
        </Form>
      )
      spy.mockRestore()
    })
  })
  it(`should warn if deprecated function props.mutators.whatever() is called`, async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const mutator = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} mutators={{ whatever: mutator }}>
        {props => {
          expect(spy).not.toHaveBeenCalled()
          expect(mutator).not.toHaveBeenCalled()
          props.mutators.whatever()
          expect(mutator).toHaveBeenCalled()
          expect(mutator).toHaveBeenCalledTimes(1)
          expect(spy).toHaveBeenCalled()
          expect(spy).toHaveBeenCalledTimes(1)
          expect(spy).toHaveBeenCalledWith(
            `Warning: As of React Final Form v3.3.0, props.mutators is deprecated and will be removed in the next major version of React Final Form. Use: props.form.mutators instead. Check your ReactFinalForm render prop.`
          )
          return <div />
        }}
      </Form>
    )
    spy.mockRestore()
  })
  it('should return a promise from handleSubmit when submission is async', async () => {
    const onSubmit = jest.fn()
    let promise
    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={async () => {
          await sleep(2)
        }}
        initialValues={{ foo: 'bar' }}
      >
        {({ handleSubmit }) => (
          <form
            onSubmit={event => {
              promise = handleSubmit(event)
              expect(promise).not.toBeUndefined()
              expect(typeof promise.then).toBe('function')
            }}
          >
            <Field name="foo" component="input" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(onSubmit).not.toHaveBeenCalled()
    const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')
    TestUtils.Simulate.submit(form)
    return promise
  })
  it('should respect validateOnBlur', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const validate = jest.fn(values => {
      const errors = {}
      if (values.foo && values.foo < 5) {
        errors.foo = 'Not enough foo!'
      }
      return errors
    })
    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        subscription={{ submitting: true }}
        validate={validate}
        validateOnBlur
      >
        {() => (
          <form>
            <Field
              name="foo"
              component={renderInput}
              subscription={{ valid: true }}
            />
          </form>
        )}
      </Form>
    )
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].meta.valid).toBe(true)
    expect(validate).toHaveBeenCalled()
    // once on form register, and again on field register
    expect(validate).toHaveBeenCalledTimes(2)
    const { onBlur, onChange, onFocus } = renderInput.mock.calls[0][0].input
    onFocus()
    expect(validate).toHaveBeenCalledTimes(2)
    expect(renderInput).toHaveBeenCalledTimes(1)
    onChange('1') // this is where it would fail if not respecting validateOnBlur
    expect(validate).toHaveBeenCalledTimes(2)
    expect(renderInput).toHaveBeenCalledTimes(1)
    onChange('10')
    expect(validate).toHaveBeenCalledTimes(2)
    expect(renderInput).toHaveBeenCalledTimes(1)
    onBlur()
    expect(validate).toHaveBeenCalledTimes(3)
    // never called again because it was never invalid
    expect(renderInput).toHaveBeenCalledTimes(1)
    onFocus()
    expect(validate).toHaveBeenCalledTimes(3)
    expect(renderInput).toHaveBeenCalledTimes(1)
    // back to invalid
    onChange('1')
    expect(validate).toHaveBeenCalledTimes(3)
    expect(renderInput).toHaveBeenCalledTimes(1)
    onBlur() // NOW should be invalid
    expect(validate).toHaveBeenCalledTimes(4)
    expect(renderInput).toHaveBeenCalledTimes(2)
  })
  it('should ignore SyntheticEvents on form reset ', () => {
    const input = jest.fn(({ input }) => <input {...input} />)
    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        subscription={{}}
        initialValues={{ foo: 'bar' }}
      >
        {({ form: { reset } }) => (
          <form>
            <Field name="foo" render={input} />
            <button onClick={reset}>Reset</button>
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
        {({ form: { reset } }) => (
          <form>
            <Field name="foo" render={input} />
            <button onClick={() => reset({ foo: 'newfoo' })}>Reset</button>
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
  it('should not repeatedly call validation for every field on mount', () => {
    const validate = jest.fn(values => ({}))
    const count = 10
    class Container extends React.Component {
      constructor() {
        super()
        this.state = { ids: [], time: undefined }
      }
      componentDidMount() {
        const ids = []
        while (ids.length < count) {
          ids.push(ids.length)
        }
        this.setState({ ids, time: Date.now() })
      }
      render() {
        return this.props.children(this.state.ids)
      }
    }
    TestUtils.renderIntoDocument(
      <Container>
        {ids => (
          <Form
            onSubmit={onSubmitMock}
            subscription={{ submitting: true }}
            initialValues={{ submitting: true }}
            validate={validate}
            validateOnBlur
            ids={ids}
            render={() => (
              <form>
                {ids.map(id => (
                  <input key={id} name={`field${id}`} />
                  // <Field key={id} name={`field${id}`} component="input" />
                ))}
              </form>
            )}
          />
        )}
      </Container>
    )
    expect(validate).toHaveBeenCalled()
    expect(validate).toHaveBeenCalledTimes(1)
  })
  it('should add decorators', () => {
    const unsubscribe = jest.fn()
    const decorator = jest.fn(() => unsubscribe)
    class Container extends React.Component {
      state = { shown: true }
      render() {
        return (
          <div>
            {this.state.shown && (
              <Form
                onSubmit={onSubmitMock}
                render={() => <form />}
                decorators={[decorator]}
              />
            )}
            <button
              type="button"
              onClick={() => this.setState({ shown: false })}
            >
              Unmount
            </button>
          </div>
        )
      }
    }
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(decorator).toHaveBeenCalled()
    expect(decorator).toHaveBeenCalledTimes(1)
    expect(unsubscribe).not.toHaveBeenCalled()
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)
    expect(unsubscribe).toHaveBeenCalled()
  })
  it('should show form as invalid on first load if field-level validation errors are present', () => {
    // Debugging https://github.com/final-form/react-final-form/issues/196
    const render = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {({ invalid }) => {
          render(invalid)
          return (
            <Field name="foo" component="input" validate={() => 'Required'} />
          )
        }}
      </Form>
    )
    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[0][0]).toBe(false)
    expect(render.mock.calls[1][0]).toBe(true)
  })
  it('should work with server-side rendering', () => {
    const spy = jest.spyOn(global.console, 'error')
    ReactDOMServer.renderToString(
      <Form
        onSubmit={onSubmitMock}
        render={() => (
          <form>
            <Field name="foo" component="input" type="text" />
          </form>
        )}
      />
    )
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
