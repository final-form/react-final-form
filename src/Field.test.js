import React from 'react'
import TestUtils from 'react-dom/test-utils'
import Form from './ReactFinalForm'
import Field from './Field'

const onSubmitMock = values => {}

describe('Field', () => {
  it('should warn error if not used inside a form', () => {
    TestUtils.renderIntoDocument(<Field name="foo" component="input" />)
  })

  it('should resubscribe if name changes', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    class Container extends React.Component {
      state = { name: 'dog' }

      render() {
        return (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{ dog: 'Odie', cat: 'Garfield' }}
          >
            {() => (
              <form>
                <Field {...this.state} render={renderInput} />
                <button
                  type="button"
                  onClick={() => this.setState({ name: 'cat' })}
                >
                  Switch
                </button>
              </form>
            )}
          </Form>
        )
      }
    }
    expect(renderInput).not.toHaveBeenCalled()
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBe('Odie')

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(renderInput).toHaveBeenCalledTimes(2)
    expect(renderInput.mock.calls[1][0].input.value).toBe('Garfield')
  })

  it('should not resubscribe if name changes when not inside a <Form> (duh)', () => {
    // This test is mainly for code coverage
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    class Container extends React.Component {
      state = { name: 'dog' }

      render() {
        return (
          <form>
            <Field {...this.state} render={renderInput} />
            <button
              type="button"
              onClick={() => this.setState({ name: 'cat' })}
            >
              Switch
            </button>
          </form>
        )
      }
    }
    expect(renderInput).not.toHaveBeenCalled()
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBe('')

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(renderInput).toHaveBeenCalledTimes(2)
    expect(renderInput.mock.calls[1][0].input.value).toBe('')
  })

  it('should render via children render function', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo">{renderInput}</Field>
      </form>
    ))
    expect(render).not.toHaveBeenCalled()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )
    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
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
                {this.state.shown && <Field name="foo" component="input" />}
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

  it('should focus, change, and blur', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} />
      </form>
    ))

    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].active).toBeUndefined()
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
    TestUtils.Simulate.focus(input)

    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[1][0].active).toBe('foo')
    expect(render.mock.calls[1][0].values.foo).toBeUndefined()

    TestUtils.Simulate.change(input, { target: { value: 'bar' } })

    expect(render).toHaveBeenCalledTimes(3)
    expect(render.mock.calls[2][0].active).toBe('foo')
    expect(render.mock.calls[2][0].values.foo).toBe('bar')

    TestUtils.Simulate.blur(input)

    expect(render).toHaveBeenCalledTimes(4)
    expect(render.mock.calls[3][0].active).toBeUndefined()
    expect(render.mock.calls[3][0].values.foo).toBe('bar')
  })

  it("should convert '' to undefined on change", () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} />
      </form>
    ))

    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')

    TestUtils.Simulate.change(input, { target: { value: 'bar' } })

    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[1][0].values.foo).toBe('bar')

    TestUtils.Simulate.change(input, { target: { value: '' } })

    expect(render).toHaveBeenCalledTimes(3)
    expect(render.mock.calls[2][0].values.foo).toBeUndefined()
  })

  it('should optionally allow null', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} allowNull />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[1][0].values.foo).toBe('bar')

    renderInput.mock.calls[0][0].input.onChange(null)

    expect(render).toHaveBeenCalledTimes(3)
    expect(render.mock.calls[2][0].values.foo).toBe(null)
  })

  it('should render checkboxes with checked prop', () => {
    const render = jest.fn(() => (
      <form>
        <Field name="foo" component="input" type="checkbox" />
      </form>
    ))

    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={render}
        initialValues={{ foo: true }}
      />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBe(true)

    const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
    expect(input.checked).toBe(true)
  })

  it('should render radio buttons with checked prop', () => {
    const render = jest.fn(() => (
      <form>
        <Field name="foo" component="input" type="radio" value="Bar" />
        <Field name="foo" component="input" type="radio" value="Baz" />
      </form>
    ))

    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={render}
        initialValues={{ foo: 'Bar' }}
      />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBe('Bar')

    const [barInput, bazInput] = TestUtils.scryRenderedDOMComponentsWithTag(
      dom,
      'input'
    )

    expect(barInput.checked).toBe(true)
    expect(bazInput.checked).toBe(false)

    render.mock.calls[0][0].change('foo', 'Baz')

    expect(barInput.checked).toBe(false)
    expect(bazInput.checked).toBe(true)
  })
})
