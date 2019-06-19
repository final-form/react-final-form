import React from 'react'
import { render, fireEvent, cleanup, act } from '@testing-library/react'
import 'jest-dom/extend-expect'
import { ErrorBoundary, Toggle, wrapWith } from './testUtils'
import Form from './ReactFinalForm'
import Field from './Field'

const onSubmitMock = values => {}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('Field', () => {
  afterEach(cleanup)

  it('should warn if not used inside a form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorSpy = jest.fn()
    render(
      <ErrorBoundary spy={errorSpy}>
        <Field name="name" component="input" />
      </ErrorBoundary>
    )
    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy.mock.calls[0][0].message).toBe(
      'useField must be used inside of a <Form> component'
    )
    console.error.mockRestore()
  })

  it('should resubscribe if name changes', () => {
    const { getByTestId, getByText } = render(
      <Toggle>
        {isCat => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{ dog: 'Odie', cat: 'Garfield' }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name={isCat ? 'cat' : 'dog'}
                  component="input"
                  data-testid="name"
                />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('Odie')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Garfield')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Odie')
  })

  it('should render via children render function', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name">
              {({ input }) => <input {...input} data-testid="name" />}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('name')).toBeDefined()
  })

  it('should render via render prop function', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field
              name="name"
              render={({ input }) => <input {...input} data-testid="name" />}
            />
          </form>
        )}
      </Form>
    )
    expect(getByTestId('name')).toBeDefined()
  })

  it('should include children when rendering via render prop function', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field
              name="color"
              render={({ input, children }) => (
                <select {...input} data-testid="color">
                  {children}
                </select>
              )}
            >
              <option value="red" data-testid="red">
                Red
              </option>
              <option value="green" data-testid="green">
                Green
              </option>
              <option value="blue" data-testid="blue">
                Blue
              </option>
            </Field>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('color')).toBeDefined()
    expect(getByTestId('red')).toBeDefined()
    expect(getByTestId('green')).toBeDefined()
    expect(getByTestId('blue')).toBeDefined()
  })

  it('should unsubscribe on unmount', () => {
    // This is mainly here for code coverage. 🧐
    const { getByText } = render(
      <Toggle>
        {hidden => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{ dog: 'Odie', cat: 'Garfield' }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {!hidden && (
                  <Field name="name" component="input" data-testid="name" />
                )}
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    fireEvent.click(getByText('Toggle'))
  })

  it('should focus, change, and blur', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {() => (
          <form>
            <Field name="name">
              {wrapWith(spy, ({ input }) => (
                <input {...input} data-testid="name" />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].meta.active).toBe(false)
    expect(spy.mock.calls[0][0].input.value).toBe('')
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].meta.active).toBe(true)
    expect(spy.mock.calls[1][0].input.value).toBe('')
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0].meta.active).toBe(true)
    expect(spy.mock.calls[2][0].input.value).toBe('erikras')
    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy.mock.calls[3][0].meta.active).toBe(false)
    expect(spy.mock.calls[3][0].input.value).toBe('erikras')
  })

  it("should convert '' to undefined on change", () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {wrapWith(spy, () => (
          <form>
            <Field name="name" component="input" data-testid="name" />
          </form>
        ))}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].values).toEqual({ name: 'erikras' })
    fireEvent.change(getByTestId('name'), { target: { value: '' } })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0].values).toEqual({})
  })

  it('should accept an identity parse prop to preserve empty strings', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {wrapWith(spy, () => (
          <form>
            <Field name="name" parse={v => v}>
              {({ input: { value, ...props } }) => (
                <input
                  {...props}
                  value={value === null ? '' : value}
                  data-testid="name"
                />
              )}
            </Field>
          </form>
        ))}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].values).toEqual({ name: 'erikras' })
    fireEvent.change(getByTestId('name'), { target: { value: '' } })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0].values).toEqual({ name: '' })
  })

  it('should accept a format function prop', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {wrapWith(spy, () => (
          <form>
            <Field
              name="name"
              component="input"
              format={value => (value ? value.toUpperCase() : '')}
              data-testid="name"
            />
          </form>
        ))}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].values).toEqual({})
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].values).toEqual({ name: 'erikras' })
    expect(getByTestId('name').value).toBe('ERIKRAS')
  })

  it('should only format on blur if formatOnBlur is true', () => {
    const format = jest.fn(value => (value ? value.toUpperCase() : ''))
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {() => (
          <form>
            <Field
              name="name"
              component="input"
              format={format}
              formatOnBlur
              data-testid="name"
            />
          </form>
        )}
      </Form>
    )
    fireEvent.focus(getByTestId('name'))
    expect(getByTestId('name').value).toBe('')
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(getByTestId('name').value).toBe('erikras')
    expect(format).not.toHaveBeenCalled()
    fireEvent.blur(getByTestId('name'))
    expect(format).toHaveBeenCalled()
    expect(format).toHaveBeenCalledTimes(1)
    expect(getByTestId('name').value).toBe('ERIKRAS')
  })

  it('should `formatOnBlur` most updated value', () => {
    const format = jest.fn(value => (value ? value.trim() : ''))
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {() => (
          <form>
            <Field name="name" format={format} formatOnBlur>
              {({ input }) => (
                <input
                  {...input}
                  data-testid="name"
                  onBlur={e => {
                    input.onChange(
                      e.target.value && e.target.value.toUpperCase()
                    )
                    input.onBlur(e)
                  }}
                />
              )}
            </Field>
          </form>
        )}
      </Form>
    )
    const inputText = '   erikras'
    fireEvent.focus(getByTestId('name'))
    expect(getByTestId('name').value).toBe('')
    fireEvent.change(getByTestId('name'), { target: { value: inputText } })
    expect(getByTestId('name').value).toBe(inputText)
    fireEvent.blur(getByTestId('name'))
    expect(format.mock.calls[0][0]).toBe(inputText.toUpperCase())
    expect(getByTestId('name').value).toBe(inputText.trim().toUpperCase())
  })

  it('should not format value at all when formatOnBlur and render prop', () => {
    const format = jest.fn(value => (value ? value.toUpperCase() : ''))
    render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {() => (
          <form>
            <Field name="name" format={format} formatOnBlur data-testid="name">
              {({ input }) => {
                expect(input.value).toBeUndefined()
                expect(format).not.toHaveBeenCalled()
                return <input {...input} value={input.value || ''} />
              }}
            </Field>
          </form>
        )}
      </Form>
    )
  })

  it('should accept an identity format prop to preserve undefined values', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {() => (
          <form>
            <Field name="name" format={v => v}>
              {wrapWith(spy, ({ input: { value, ...props } }) => (
                <input
                  {...props}
                  value={value === undefined ? '' : value}
                  data-testid="name"
                />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].input.value).toBeUndefined()
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].input.value).toBe('erikras')
    fireEvent.change(getByTestId('name'), { target: { value: '' } })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0].input.value).toBeUndefined()
  })

  it('should provide a value of [] when empty on a select multiple', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{ values: true }}>
        {() => (
          <form>
            <Field name="name" component="select" multiple data-testid="name" />
          </form>
        )}
      </Form>
    )

    // This test is mostly for code coverage. Is there a way to assure that the value prop
    // passed to the <select> is []?
    expect(getByTestId('name').value).toBe('')
  })

  it('should optionally allow null values', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ name: null }}
        subscription={{ values: true }}
      >
        {() => (
          <form>
            <Field name="name" allowNull>
              {wrapWith(spy, ({ input: { value, ...props } }) => (
                <input
                  {...props}
                  value={value === null ? '' : value}
                  data-testid="name"
                />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].input.value).toBe(null)
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].input.value).toBe('erikras')
    act(() => {
      spy.mock.calls[1][0].input.onChange(null)
    })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0].input.value).toBe(null)
  })

  it('should not allow null values when allowNull not true', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ name: null }}
        subscription={{ values: true }}
      >
        {() => (
          <form>
            <Field name="name">
              {wrapWith(spy, ({ input: { value, ...props } }) => (
                <input
                  {...props}
                  value={value === null ? '' : value}
                  data-testid="name"
                />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].input.value).toBe('')
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].input.value).toBe('erikras')
    act(() => {
      spy.mock.calls[1][0].input.onChange(null)
    })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0].input.value).toBe('')
  })

  it('should not let validate prop bleed through', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {() => (
          <form>
            <Field name="name">
              {wrapWith(spy, ({ input }) => (
                <input {...input} data-testid="name" />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].validate).toBeUndefined()
  })

  it('should not let subscription prop bleed through', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {() => (
          <form>
            <Field name="name" subscription={{ value: true }}>
              {wrapWith(spy, ({ input }) => (
                <input {...input} data-testid="name" />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].subscription).toBeUndefined()
  })

  it('should allow changing field-level validation function', () => {
    const simpleValidate = value => (value ? undefined : 'Required')
    const complexValidate = value => {
      if (value) {
        if (value !== value.toUpperCase()) {
          return 'SHOULD BE UPPERCASE!'
        }
      } else {
        return 'Required'
      }
    }
    const { getByTestId, getByText } = render(
      <Toggle>
        {useComplexValidation => (
          <Form onSubmit={onSubmitMock}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="name"
                  validate={
                    useComplexValidation ? complexValidate : simpleValidate
                  }
                  key={useComplexValidation ? 1 : 0}
                >
                  {({ input, meta }) => (
                    <div>
                      <input {...input} data-testid="name" />
                      <div data-testid="error">{meta.error}</div>
                    </div>
                  )}
                </Field>
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('error')).toHaveTextContent('Required')
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(getByTestId('error')).toHaveTextContent('')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('error')).toHaveTextContent('SHOULD BE UPPERCASE!')
    fireEvent.change(getByTestId('name'), { target: { value: 'ERIKRAS' } })
    expect(getByTestId('error')).toHaveTextContent('')
  })

  it('should not rerender if validateFields is !== every time', () => {
    // https://github.com/final-form/react-final-form/issues/502
    const required = value => (value ? undefined : 'Required')
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" validate={required} validateFields={[]}>
              {wrapWith(spy, ({ input, meta }) => (
                <div>
                  <input {...input} data-testid="name" />
                  <div data-testid="error">{meta.error}</div>
                </div>
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    // first render registered validation, second contains error
    expect(spy).toHaveBeenCalledTimes(2)
    expect(getByTestId('error')).toHaveTextContent('Required')
  })

  it('should pass along type prop', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="checkbox"
              component="input"
              type="checkbox"
              data-testid="checkbox"
            />
            <Field
              name="password"
              component="input"
              type="password"
              data-testid="password"
            />
            <Field
              name="radio"
              component="input"
              type="radio"
              data-testid="radio"
            />
          </form>
        )}
      </Form>
    )
    expect(getByTestId('checkbox').type).toBe('checkbox')
    expect(getByTestId('password').type).toBe('password')
    expect(getByTestId('radio').type).toBe('radio')
  })

  it('should render checkboxes with checked prop', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="employed"
              component="input"
              type="checkbox"
              data-testid="employed"
            />
          </form>
        )}
      </Form>
    )
    expect(getByTestId('employed').type).toBe('checkbox')
    expect(getByTestId('employed').checked).toBe(false)
    fireEvent.change(getByTestId('employed'), { target: { checked: true } })
    expect(getByTestId('employed').checked).toBe(true)
  })

  it('should render "array" checkboxes with checked prop when value is included in array', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ colors: ['red', 'blue'] }}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="colors"
              component="input"
              type="checkbox"
              value="red"
              data-testid="red"
            />
            <Field
              name="colors"
              component="input"
              type="checkbox"
              value="green"
              data-testid="green"
            />
            <Field
              name="colors"
              component="input"
              type="checkbox"
              value="blue"
              data-testid="blue"
            />
          </form>
        )}
      </Form>
    )
    expect(getByTestId('red').checked).toBe(true)
    expect(getByTestId('green').checked).toBe(false)
    expect(getByTestId('blue').checked).toBe(true)
  })

  it('should render "array" custom checkboxes with checked prop when value is included in array', () => {
    const red = jest.fn()
    const green = jest.fn()
    const blue = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} initialValues={{ colors: ['red', 'blue'] }}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="colors" type="checkbox" value="red">
              {wrapWith(red, ({ input }) => (
                <input {...input} />
              ))}
            </Field>
            <Field name="colors" type="checkbox" value="green">
              {wrapWith(green, ({ input }) => (
                <input {...input} />
              ))}
            </Field>
            <Field name="colors" type="checkbox" value="blue">
              {wrapWith(blue, ({ input }) => (
                <input {...input} />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(red).toHaveBeenCalled()
    expect(red).toHaveBeenCalledTimes(2)
    expect(red.mock.calls[0][0].input.checked).toBe(true)
    expect(red.mock.calls[1][0].input.checked).toBe(true)
    expect(green).toHaveBeenCalled()
    expect(green).toHaveBeenCalledTimes(2)
    expect(green.mock.calls[0][0].input.checked).toBe(false)
    expect(green.mock.calls[1][0].input.checked).toBe(false)
    expect(blue).toHaveBeenCalled()
    expect(blue).toHaveBeenCalledTimes(2)
    expect(blue.mock.calls[0][0].input.checked).toBe(true)
    expect(blue.mock.calls[1][0].input.checked).toBe(true)
  })

  it('should render radio buttons with checked prop', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ color: 'green' }}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="color"
              component="input"
              type="radio"
              value="red"
              data-testid="red"
            />
            <Field
              name="color"
              component="input"
              type="radio"
              value="green"
              data-testid="green"
            />
            <Field
              name="color"
              component="input"
              type="radio"
              value="blue"
              data-testid="blue"
            />
          </form>
        )}
      </Form>
    )
    expect(getByTestId('red').type).toBe('radio')
    expect(getByTestId('red').checked).toBe(false)
    expect(getByTestId('green').type).toBe('radio')
    expect(getByTestId('green').checked).toBe(true)
    expect(getByTestId('blue').type).toBe('radio')
    expect(getByTestId('blue').checked).toBe(false)
  })

  it('should render custom radio component with checked prop', () => {
    const red = jest.fn()
    const green = jest.fn()
    const blue = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} initialValues={{ color: 'green' }}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="color" type="radio" value="red">
              {wrapWith(red, ({ input }) => (
                <input {...input} />
              ))}
            </Field>
            <Field name="color" type="radio" value="green">
              {wrapWith(green, ({ input }) => (
                <input {...input} />
              ))}
            </Field>
            <Field name="color" type="radio" value="blue">
              {wrapWith(blue, ({ input }) => (
                <input {...input} />
              ))}
            </Field>
          </form>
        )}
      </Form>
    )
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(red).toHaveBeenCalled()
    expect(red).toHaveBeenCalledTimes(2)
    expect(red.mock.calls[0][0].input.checked).toBe(false)
    expect(red.mock.calls[1][0].input.checked).toBe(false)
    expect(green).toHaveBeenCalled()
    expect(green).toHaveBeenCalledTimes(2)
    expect(green.mock.calls[0][0].input.checked).toBe(true)
    expect(green.mock.calls[1][0].input.checked).toBe(true)
    expect(blue).toHaveBeenCalled()
    expect(blue).toHaveBeenCalledTimes(2)
    expect(blue.mock.calls[0][0].input.checked).toBe(false)
    expect(blue.mock.calls[1][0].input.checked).toBe(false)
  })

  it('should use isEqual to calculate dirty/pristine', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ name: 'bob' }}>
        {() => (
          <form>
            <Field
              name="name"
              isEqual={(a, b) =>
                (a && a.toUpperCase()) === (b && b.toUpperCase())
              }
            >
              {({ input, meta }) => (
                <div>
                  <div data-testid="dirty">
                    {meta.dirty ? 'Dirty' : 'Pristine'}
                  </div>
                  <input {...input} data-testid="input" />
                </div>
              )}
            </Field>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('input').value).toBe('bob')
    expect(getByTestId('dirty')).toHaveTextContent('Pristine')
    fireEvent.change(getByTestId('input'), { target: { value: 'bobby' } })
    expect(getByTestId('dirty')).toHaveTextContent('Dirty')
    fireEvent.change(getByTestId('input'), { target: { value: 'BOB' } })
    expect(getByTestId('dirty')).toHaveTextContent('Pristine')
  })

  it('should only call each field-level validation once upon initial mount', () => {
    const fooValidate = jest.fn()
    const barValidate = jest.fn()
    const bazValidate = jest.fn()
    render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="foo" component="input" validate={fooValidate} />
            <Field name="bar" component="input" validate={barValidate} />
            <Field name="baz" component="input" validate={bazValidate} />
          </form>
        )}
      </Form>
    )
    expect(fooValidate).toHaveBeenCalledTimes(1)
    expect(barValidate).toHaveBeenCalledTimes(1)
    expect(bazValidate).toHaveBeenCalledTimes(1)
  })

  it('should warn when used without type prop and rendering radio, checkbox or multiple select indirectly', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ selectMultipleInput: [] }}>
        {() => (
          <form>
            <Field name="checkboxInput" value="checkboxValue">
              {({ input }) => (
                <input type="checkbox" {...input} data-testid="checkbox" />
              )}
            </Field>
            <Field name="radioInput" value="radioValue">
              {({ input }) => (
                <input type="radio" {...input} data-testid="radio" />
              )}
            </Field>
            <Field name="selectMultipleInput">
              {({ input }) => (
                <select multiple {...input} data-testid="select">
                  <option>{'Option'}</option>
                </select>
              )}
            </Field>
          </form>
        )}
      </Form>
    )

    expect(errorSpy).not.toHaveBeenCalled()
    fireEvent.click(getByTestId('checkbox'), {
      target: { type: 'checkbox', checked: true }
    })
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy.mock.calls[0][0]).toBe(
      'You must pass `type="checkbox"` prop to your Field(checkboxInput) component.\n' +
        'Without it we don\'t know how to unpack your `value` prop - "checkboxValue".'
    )
    fireEvent.click(getByTestId('radio'), {
      target: { type: 'radio', value: 'radio value' }
    })
    expect(errorSpy).toHaveBeenCalledTimes(2)
    expect(errorSpy.mock.calls[1][0]).toBe(
      'You must pass `type="radio"` prop to your Field(radioInput) component.\n' +
        'Without it we don\'t know how to unpack your `value` prop - "radioValue".'
    )
    fireEvent.change(getByTestId('select'), {
      target: { value: ['some value'] }
    })
    expect(errorSpy).toHaveBeenCalledTimes(3)
    expect(errorSpy.mock.calls[2][0]).toBe(
      'You must pass `type="select"` prop to your Field(selectMultipleInput) component.\n' +
        "Without it we don't know how to unpack your `value` prop - []."
    )
    errorSpy.mockRestore()
  })

  it('should formatOnBlur on submit', () => {
    const onSubmit = jest.fn()
    const { getByTestId, getByText } = render(
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              component="input"
              format={value => value && value.toUpperCase()}
              formatOnBlur
              data-testid="name"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('name').value).toBe('')
    fireEvent.focus(getByTestId('name'))
    fireEvent.change(getByTestId('name'), { target: { value: 'erik' } })
    expect(getByTestId('name').value).toBe('erik')
    fireEvent.blur(getByTestId('name'))
    expect(getByTestId('name').value).toBe('ERIK')

    fireEvent.focus(getByTestId('name'))
    fireEvent.change(getByTestId('name'), { target: { value: 'ERIKras' } })
    expect(getByTestId('name').value).toBe('ERIKras')

    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'ERIKRAS' })

    // submit again with no need for format
    fireEvent.click(getByText('Submit'))
    expect(onSubmit).toHaveBeenCalledTimes(2)
    expect(onSubmit.mock.calls[1][0]).toEqual({ name: 'ERIKRAS' })
  })

  it('should allow submission to be cancelled in beforeSubmit', () => {
    const onSubmit = jest.fn()
    const beforeSubmit = jest.fn(() => false)
    const { getByTestId, getByText } = render(
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              component="input"
              beforeSubmit={beforeSubmit}
              data-testid="name"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('name').value).toBe('')
    fireEvent.focus(getByTestId('name'))
    fireEvent.change(getByTestId('name'), { target: { value: 'erik' } })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(beforeSubmit).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(beforeSubmit).toHaveBeenCalled()
  })

  it('update validating flag on async field-level validation', async () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              component="input"
              validate={async value => {
                await sleep(5)
                return value === 'erikras' ? 'Username taken' : undefined
              }}
              data-testid="name"
            />
            <Field name="name" subscription={{ validating: true }}>
              {({ meta: { validating } }) => (
                <div data-testid="validating">
                  {validating === true ? 'Spinner' : 'Not Validating'}
                </div>
              )}
            </Field>
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('validating')).toHaveTextContent('Spinner')

    await sleep(6)

    expect(getByTestId('name').value).toBe('')
    fireEvent.focus(getByTestId('name'))
    expect(getByTestId('validating')).toHaveTextContent('Not Validating')

    fireEvent.change(getByTestId('name'), { target: { value: 'erik' } })
    expect(getByTestId('validating')).toHaveTextContent('Spinner')

    await sleep(6)

    expect(getByTestId('validating')).toHaveTextContent('Not Validating')

    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(getByTestId('validating')).toHaveTextContent('Spinner')

    await sleep(6)

    expect(getByTestId('validating')).toHaveTextContent('Not Validating')
  })
})
