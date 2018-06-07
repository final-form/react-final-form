import React from 'react'
import TestUtils from 'react-dom/test-utils'
import Form from './ReactFinalForm'
import Field from './Field'

const onSubmitMock = values => {}

describe('Field', () => {
  it('should warn if not used inside a form', () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    TestUtils.renderIntoDocument(<Field name="foo" component="input" />)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: Field must be used inside of a ReactFinalForm component'
    )
    spy.mockRestore()
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

    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[2][0].input.value).toBe('Garfield')
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
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    expect(renderInput).not.toHaveBeenCalled()
    const dom = TestUtils.renderIntoDocument(<Container />)
    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBe('')

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(renderInput).toHaveBeenCalledTimes(2)
    expect(renderInput.mock.calls[1][0].input.value).toBe('')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'Warning: Field must be used inside of a ReactFinalForm component'
    )
    spy.mockRestore()
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

  it('should accept a null parse prop to preserve empty strings', () => {
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} parse={null} />
      </form>
    ))

    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')

    TestUtils.Simulate.change(input, { target: { value: '' } })

    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[1][0].values.foo).toBe('')

    TestUtils.Simulate.change(input, { target: { value: 'abc' } })

    expect(render).toHaveBeenCalledTimes(3)
    expect(render.mock.calls[2][0].values.foo).toBe('abc')
  })

  it('should accept a format function prop', () => {
    const format = jest.fn((value, name) => `format.${value}`)
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} format={format} />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    expect(format).toHaveBeenCalled()
    expect(format).toHaveBeenCalledTimes(1)
    expect(format.mock.calls[0]).toEqual([undefined, 'foo'])

    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBe('format.undefined')

    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(format).toHaveBeenCalledTimes(3)
    expect(format.mock.calls[2]).toEqual(['bar', 'foo'])

    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[2][0].input.value).toBe('format.bar')
  })

  it('should only format on blur if formatOnBlur is true', () => {
    const format = jest.fn((value, name) => `format.${value}`)
    const renderInput = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} format={format} formatOnBlur />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} subscription={{}} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values).toBeUndefined()

    expect(format).not.toHaveBeenCalled()

    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBe('')

    const { onFocus, onChange, onBlur } = renderInput.mock.calls[0][0].input

    onFocus()
    expect(renderInput).toHaveBeenCalledTimes(2)
    onChange('bar')
    expect(renderInput).toHaveBeenCalledTimes(3)

    expect(format).not.toHaveBeenCalled()

    onBlur()

    expect(format).toHaveBeenCalled()
    expect(format).toHaveBeenCalledTimes(1)
    expect(format.mock.calls[0]).toEqual(['bar', 'foo'])

    expect(renderInput).toHaveBeenCalledTimes(5)
    expect(renderInput.mock.calls[4][0].input.value).toBe('format.bar')
  })

  it('should accept a null format prop to preserve undefined values', () => {
    const renderInput = jest.fn(({ input }) => (
      <input {...input} value={input.value || ''} />
    ))
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} format={null} />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBeUndefined()

    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[2][0].input.value).toBe('bar')
  })

  it('should provide a value of [] when empty on a select multiple', () => {
    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="foo" component="select" multiple />
          </form>
        )}
      </Form>
    )

    // This test is mostly for code coverage. Is there a way to assure that the value prop
    // passed to the <select> is []?
    const select = TestUtils.findRenderedDOMComponentWithTag(dom, 'select')
    expect(select.value).toBe('')
  })

  it("should convert undefined values to ''", () => {
    const renderInput = jest.fn(({ input }) => (
      <input {...input} value={input.value} />
    ))
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(renderInput).toHaveBeenCalled()
    expect(renderInput).toHaveBeenCalledTimes(1)
    expect(renderInput.mock.calls[0][0].input.value).toBe('')

    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(renderInput).toHaveBeenCalledTimes(3)
    expect(renderInput.mock.calls[2][0].input.value).toBe('bar')

    renderInput.mock.calls[1][0].input.onChange(null)

    expect(renderInput).toHaveBeenCalledTimes(5)
    expect(renderInput.mock.calls[4][0].input.value).toBe('')
  })

  it('should optionally allow null values', () => {
    const renderInput = jest.fn(({ input }) => (
      <input
        {...input}
        value={input.value || "we don't REALLY want null. lol!"}
      />
    ))
    const render = jest.fn(() => (
      <form>
        <Field name="foo" render={renderInput} allowNull />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} render={render} />
    )

    expect(render).toHaveBeenCalled()
    // called twice due to field registration adding touched and visited values
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toBeUndefined()

    renderInput.mock.calls[0][0].input.onChange('bar')

    expect(render).toHaveBeenCalledTimes(2)
    expect(render.mock.calls[1][0].values.foo).toBe('bar')

    renderInput.mock.calls[0][0].input.onChange(null)

    expect(render).toHaveBeenCalledTimes(3)
    expect(render.mock.calls[2][0].values.foo).toBe(null)
  })

  it('should not let validate prop bleed through', () => {
    const input = jest.fn(({ input }) => <input {...input} />)
    const required = value => (value ? undefined : 'Required')

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="foo" render={input} validate={required} />
          </form>
        )}
      </Form>
    )

    expect(input).toHaveBeenCalled()
    // called twice due to field registration adding touched and visited values
    expect(input).toHaveBeenCalledTimes(2)
    expect(input.mock.calls[1][0].validate).toBeUndefined()
  })

  it('should not let subscription prop bleed through', () => {
    const input = jest.fn(({ input }) => <input {...input} />)

    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="foo" render={input} subscription={{ active: true }} />
          </form>
        )}
      </Form>
    )

    expect(input).toHaveBeenCalled()
    // called twice due to field registration adding touched and visited values
    expect(input).toHaveBeenCalledTimes(1)
    expect(input.mock.calls[0][0].subscription).toBeUndefined()
  })

  it('should allow changing field-level validation function', () => {
    const input = jest.fn(({ input }) => <input {...input} />)
    const required = value => (value ? undefined : 'Required')
    const requiredUppercase = value =>
      !value
        ? 'Required'
        : value.toUpperCase() === value ? undefined : 'Must be uppercase'
    class FieldsContainer extends React.Component {
      state = { uppercase: false }

      render() {
        return (
          <form>
            <Field
              name="foo"
              render={input}
              validate={this.state.uppercase ? requiredUppercase : required}
            />
            <button
              type="button"
              onClick={() => this.setState({ uppercase: true })}
            >
              Require Uppercase
            </button>
          </form>
        )
      }
    }

    const dom = TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} component={FieldsContainer} />
    )

    expect(input).toHaveBeenCalled()
    // called twice due to field registration adding touched and visited values
    expect(input).toHaveBeenCalledTimes(2)
    expect(input.mock.calls[1][0].meta.error).toBe('Required')

    const { input: { onChange } } = input.mock.calls[1][0]

    onChange('hi')

    // valid now
    expect(input).toHaveBeenCalledTimes(4)
    expect(input.mock.calls[3][0].meta.error).toBeUndefined()

    // toggle rules
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    // props changed, but still valid. doesn't update until next time validation is run
    expect(input).toHaveBeenCalledTimes(5)
    expect(input.mock.calls[4][0].meta.error).toBeUndefined()

    onChange('his')

    // invalid now
    expect(input).toHaveBeenCalledTimes(7)
    expect(input.mock.calls[6][0].meta.error).toBe('Must be uppercase')
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

  it('should render "array" checkboxes with checked prop when value is included in array', () => {
    const render = jest.fn(() => (
      <form>
        <Field name="foo" component="input" type="checkbox" value="a" />
        <Field name="foo" component="input" type="checkbox" value="d" />
      </form>
    ))

    const dom = TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={render}
        initialValues={{ foo: ['a', 'b', 'c'] }}
      />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toEqual(['a', 'b', 'c'])

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'input')
    expect(inputs[0].checked).toBe(true)
    expect(inputs[1].checked).toBe(false)
  })

  it('should render "array" custom checkboxes with checked prop when value is included in array', () => {
    const checkboxA = jest.fn(({ input }) => <input {...input} />)
    const checkboxD = jest.fn(({ input }) => <input {...input} />)
    const render = jest.fn(() => (
      <form>
        <Field name="foo" component={checkboxA} type="checkbox" value="a" />
        <Field name="foo" component={checkboxD} type="checkbox" value="d" />
      </form>
    ))

    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={render}
        initialValues={{ foo: ['a', 'b', 'c'] }}
      />
    )

    expect(render).toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0].values.foo).toEqual(['a', 'b', 'c'])

    expect(checkboxA).toHaveBeenCalled()
    expect(checkboxA).toHaveBeenCalledTimes(1)
    expect(checkboxA.mock.calls[0][0].input.checked).toBe(true)

    expect(checkboxD).toHaveBeenCalled()
    expect(checkboxD).toHaveBeenCalledTimes(1)
    expect(checkboxD.mock.calls[0][0].input.checked).toBe(false)
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

    render.mock.calls[0][0].form.change('foo', 'Baz')

    expect(barInput.checked).toBe(false)
    expect(bazInput.checked).toBe(true)
  })

  it('should render custom radio component with checked prop', () => {
    const Radio = jest.fn(() => null)
    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={() => (
          <form>
            <Field name="foo" type="radio" value="yes" component={Radio} />
          </form>
        )}
        initialValues={{ foo: 'yes' }}
      />
    )
    expect(Radio.mock.calls[0][0]).toMatchObject({ input: { checked: true } })
  })

  it('should render custom checkbox component with checked prop', () => {
    const Checkbox = jest.fn(() => null)
    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={() => (
          <form>
            <Field name="foo" type="checkbox" component={Checkbox} />
          </form>
        )}
        initialValues={{ foo: true }}
      />
    )
    expect(Checkbox.mock.calls[0][0]).toMatchObject({
      input: { checked: true }
    })
  })

  it('should use isEqual to calculate dirty/pristine', () => {
    const input = jest.fn(({ input }) => <input {...input} />)

    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ foo: 'Bar' }}
        subscription={{ pristine: true }}
      >
        {() => (
          <form>
            <Field
              name="foo"
              render={input}
              isEqual={(a, b) =>
                (a && a.toUpperCase()) === (b && b.toUpperCase())
              }
            />
          </form>
        )}
      </Form>
    )

    expect(input).toHaveBeenCalled()
    expect(input).toHaveBeenCalledTimes(1)
    expect(input.mock.calls[0][0].meta.dirty).toBe(false)
    expect(input.mock.calls[0][0].meta.pristine).toBe(true)

    input.mock.calls[0][0].input.onChange('BAR')

    expect(input).toHaveBeenCalledTimes(2)
    expect(input.mock.calls[1][0].meta.dirty).toBe(false)
    expect(input.mock.calls[1][0].meta.pristine).toBe(true)

    input.mock.calls[0][0].input.onChange('BARK')

    expect(input).toHaveBeenCalledTimes(4) // once for form and once for field
    expect(input.mock.calls[3][0].meta.dirty).toBe(true)
    expect(input.mock.calls[3][0].meta.pristine).toBe(false)

    input.mock.calls[0][0].input.onChange('baR')

    expect(input).toHaveBeenCalledTimes(6) // once for form and once for field
    expect(input.mock.calls[5][0].meta.dirty).toBe(false)
    expect(input.mock.calls[5][0].meta.pristine).toBe(true)
  })

  it('should only call each field-level validation once upon initial mount', () => {
    const fooValidate = jest.fn()
    const barValidate = jest.fn()
    const bazValidate = jest.fn()
    TestUtils.renderIntoDocument(
      <Form
        onSubmit={onSubmitMock}
        render={() => (
          <form>
            <Field
              name="foo"
              component="input"
              type="text"
              validate={fooValidate}
            />
            <Field
              name="bar"
              component="input"
              type="text"
              validate={barValidate}
            />
            <Field
              name="baz"
              component="input"
              type="text"
              validate={bazValidate}
            />
          </form>
        )}
      />
    )
    expect(fooValidate).toHaveBeenCalledTimes(1)
    expect(barValidate).toHaveBeenCalledTimes(1)
    expect(bazValidate).toHaveBeenCalledTimes(1)
  })

  it('should warn when used without type prop and rendering radio, checkbox or multiple select indirectly', () => {
    class Container extends React.Component {
      render() {
        return (
          <Form initialValues={{ select_test: [] }} onSubmit={() => {}}>
            {() => (
              <div>
                <Field name="checkbox_test" value="checkbox_value">
                  {({ input }) => <input type="checkbox" {...input} />}
                </Field>
                <Field name="radio_test" value="radio_value">
                  {({ input }) => <input type="radio" {...input} />}
                </Field>
                <Field name="select_test">
                  {({ input }) => (
                    <select multiple {...input}>
                      <option>{'Option'}</option>
                    </select>
                  )}
                </Field>
              </div>
            )}
          </Form>
        )
      }
    }

    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
    const dom = TestUtils.renderIntoDocument(<Container />)

    const [checkbox, radio] = TestUtils.scryRenderedDOMComponentsWithTag(
      dom,
      'input'
    )
    const [select] = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'select')

    TestUtils.Simulate.change(checkbox, {
      target: { type: 'checkbox', value: 'checkbox_value' }
    })
    TestUtils.Simulate.change(radio, {
      target: { type: 'radio', value: 'radio_value' }
    })
    TestUtils.Simulate.change(select, {
      target: { type: 'select-multiple', value: ['select_value'] }
    })

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[0][0]).toBe(
      'Warning: You must pass `type="checkbox"` prop to your Field(checkbox_test) component.\n' +
        'Without it we don\'t know how to unpack your `value` prop - "checkbox_value".'
    )
    expect(spy.mock.calls[1][0]).toBe(
      'Warning: You must pass `type="radio"` prop to your Field(radio_test) component.\n' +
        'Without it we don\'t know how to unpack your `value` prop - "radio_value".'
    )
    expect(spy.mock.calls[2][0]).toBe(
      'Warning: You must pass `type="select"` prop to your Field(select_test) component.\n' +
        "Without it we don't know how to unpack your `value` prop - []."
    )

    spy.mockRestore()
  })
})
