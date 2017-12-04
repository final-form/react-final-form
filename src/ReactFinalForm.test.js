import React from 'react'
import TestUtils from 'react-dom/test-utils'
import Form from './ReactFinalForm'
import Field from './Field'

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
    TestUtils.renderIntoDocument(<Form onSubmit={onSubmitMock} />)
  })

  it('should print a warning with no onSubmit specified', () => {
    const render = jest.fn(() => <div />)
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(<Form render={render} />)
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
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
    expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' })
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
  })
})
