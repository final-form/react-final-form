import React from 'react'
import { render, fireEvent, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import deepEqual from 'fast-deep-equal'
import { ErrorBoundary, Toggle, wrapWith } from './testUtils'
import { createForm } from 'final-form'
import { Form, Field, version, withTypes } from '.'

const onSubmitMock = values => {}
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))
async function sleep(ms) {
  await act(async () => {
    await timeout(ms)
  })
}

describe('ReactFinalForm', () => {
  afterEach(cleanup)

  it('should export version', () => {
    expect(version).toBeDefined()
  })

  it('should export withTypes', () => {
    // mostly for code coverage
    expect(withTypes).toBeDefined()
    expect(withTypes()).toBeDefined()
  })

  it('should render with render function', () => {
    const { getByTestId } = render(
      <Form
        onSubmit={onSubmitMock}
        render={() => <div data-testid="myDiv" />}
      />
    )
    expect(getByTestId('myDiv')).toBeDefined()
  })

  it('should render with children render function', () => {
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>{() => <div data-testid="myDiv" />}</Form>
    )
    expect(getByTestId('myDiv')).toBeDefined()
  })

  it('should print a warning with no render or children specified', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorSpy = jest.fn()
    render(
      <ErrorBoundary spy={errorSpy}>
        <Form onSubmit={onSubmitMock} />
      </ErrorBoundary>
    )
    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy.mock.calls[0][0].message).toBe(
      'Must specify either a render prop, a render function as children, or a component prop to ReactFinalForm'
    )
    console.error.mockRestore()
  })

  it('should print a warning with no onSubmit specified', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorSpy = jest.fn()
    render(
      <ErrorBoundary spy={errorSpy}>
        <Form render={() => <div data-testid="myDiv" />} />
      </ErrorBoundary>
    )
    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy.mock.calls[0][0].message).toBe(
      'No onSubmit function specified'
    )
    console.error.mockRestore()
  })

  it('should allow render to be a component', () => {
    const Component = () => <div data-testid="myDiv" />
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} component={Component} />
    )
    expect(getByTestId('myDiv')).toBeDefined()
  })

  it('should unsubscribe on unmount', () => {
    // This is mainly here for code coverage. 🧐
    const Container = () => {
      const [shown, setShown] = React.useState(true)
      return (
        <div>
          {shown && <Form onSubmit={onSubmitMock} render={() => <form />} />}
          <button type="button" onClick={() => setShown(false)}>
            Unmount
          </button>
        </div>
      )
    }
    const { getByText } = render(
      <Form onSubmit={onSubmitMock} component={Container} />
    )
    fireEvent.click(getByText('Unmount'))
  })

  it('should render with a field', () => {
    const formRender = jest.fn()
    const fieldRender = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {wrapWith(formRender, () => (
          <form>
            <Field name="firstName">
              {wrapWith(fieldRender, ({ input, meta }) => (
                <>
                  <div data-testid="firstNameActive">
                    {meta.active ? 'active' : 'inactive'}
                  </div>
                  <input data-testid="firstName" {...input} />
                </>
              ))}
            </Field>
          </form>
        ))}
      </Form>
    )
    const firstName = getByTestId('firstName')
    const active = getByTestId('firstNameActive')
    expect(firstName).toBeDefined()
    expect(active).toBeDefined()
    expect(firstName.value).toBe('')
    expect(active).toHaveTextContent('inactive')
    // All forms render twice at first because they need to update their validation
    // and touched/modified/visited maps every time new fields are registered.
    expect(formRender).toHaveBeenCalledTimes(2)
    expect(fieldRender).toHaveBeenCalledTimes(2)
    fireEvent.focus(firstName)
    expect(formRender).toHaveBeenCalledTimes(3)
    expect(fieldRender).toHaveBeenCalledTimes(3)
    expect(active).toHaveTextContent('active')
    fireEvent.change(firstName, { target: { value: 'E' } })
    expect(formRender).toHaveBeenCalledTimes(4)
    expect(fieldRender).toHaveBeenCalledTimes(4)
    expect(firstName.value).toBe('E')
    fireEvent.change(firstName, { target: { value: 'Er' } })
    expect(formRender).toHaveBeenCalledTimes(5)
    expect(fieldRender).toHaveBeenCalledTimes(5)
    fireEvent.change(firstName, { target: { value: 'Eri' } })
    expect(formRender).toHaveBeenCalledTimes(6)
    expect(fieldRender).toHaveBeenCalledTimes(6)
    fireEvent.change(firstName, { target: { value: 'Erik' } })
    expect(formRender).toHaveBeenCalledTimes(7)
    expect(fieldRender).toHaveBeenCalledTimes(7)
    expect(active).toHaveTextContent('active')
    fireEvent.blur(firstName)
    expect(formRender).toHaveBeenCalledTimes(8)
    expect(fieldRender).toHaveBeenCalledTimes(8)
    expect(active).toHaveTextContent('inactive')
  })

  it('should render with a field with a limited subscription', () => {
    const formRender = jest.fn()
    const fieldRender = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {wrapWith(formRender, () => (
          <form>
            <Field name="firstName" subscription={{ value: true }}>
              {wrapWith(fieldRender, ({ input, meta }) => (
                <>
                  <div data-testid="firstNameActive">
                    {meta.active ? 'active' : 'inactive'}
                  </div>
                  <input data-testid="firstName" {...input} />
                </>
              ))}
            </Field>
          </form>
        ))}
      </Form>
    )
    const firstName = getByTestId('firstName')
    const active = getByTestId('firstNameActive')
    expect(firstName).toBeDefined()
    expect(active).toBeDefined()
    expect(firstName.value).toBe('')
    expect(active).toHaveTextContent('inactive')
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(1)
    fireEvent.focus(firstName)
    // not subscribing to active, so no rerender!
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(1)
    expect(active).toHaveTextContent('inactive')
    fireEvent.change(firstName, { target: { value: 'E' } })
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(2)
    expect(firstName.value).toBe('E')
    fireEvent.change(firstName, { target: { value: 'Er' } })
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(3)
    fireEvent.change(firstName, { target: { value: 'Eri' } })
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(4)
    fireEvent.change(firstName, { target: { value: 'Erik' } })
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(5)
    expect(active).toHaveTextContent('inactive')
    fireEvent.blur(firstName)
    // no rerender
    expect(formRender).toHaveBeenCalledTimes(1)
    expect(fieldRender).toHaveBeenCalledTimes(5)
    expect(active).toHaveTextContent('inactive')
  })

  it('should call onSubmit when form is submitted', () => {
    const onSubmit = jest.fn()
    const { getByTestId, getByText } = render(
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form data-testid="form" onSubmit={handleSubmit}>
            <Field name="firstName" component="input" data-testid="firstName" />
            <Field name="lastName" component="input" data-testid="lastName" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    fireEvent.change(getByTestId('firstName'), { target: { value: 'Erik' } })
    fireEvent.change(getByTestId('lastName'), {
      target: { value: 'Rasmussen' }
    })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({
      firstName: 'Erik',
      lastName: 'Rasmussen'
    })
  })

  // it('should not throw when handleSubmit is called with no event', () => {
  //   const onSubmit = jest.fn()
  //   const { getByTestId, getByText } = render(
  //     <Form onSubmit={onSubmit}>
  //       {({ handleSubmit }) => (
  //         <form
  //           data-testid="form"
  //           onSubmit={values => {
  //             handleSubmit(values)
  //           }}
  //         >
  // <Field name="firstName" component="input" data-testid="firstName"/>
  // <Field name="lastName" component="input" data-testid="lastName"/>
  //           <button type="submit">Submit</button>
  //         </form>
  //       )}
  //     </Form>
  //   )
  //   fireEvent.change(getByTestId('firstName'), { target: { value: 'Erik' } })
  //   fireEvent.change(getByTestId('lastName'), {
  //     target: { value: 'Rasmussen' }
  //   })
  //   expect(onSubmit).not.toHaveBeenCalled()
  //   fireEvent.click(getByText('Submit'))
  //   expect(onSubmit).toHaveBeenCalled()
  //   expect(onSubmit).toHaveBeenCalledTimes(1)
  //   expect(onSubmit.mock.calls[0][0]).toEqual({
  //     firstName: 'Erik',
  //     lastName: 'Rasmussen'
  //   })
  // })

  it('should reinitialize when initialValues prop changes', () => {
    const initialValues = {
      name: 'Dr. Jekyll'
    }
    const alternateInitialValues = {
      name: 'Mr. Hyde'
    }
    const { getByTestId, getByText } = render(
      <Toggle>
        {useAlternateInitialValues => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={
              useAlternateInitialValues ? alternateInitialValues : initialValues
            }
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('Dr. Jekyll')
    fireEvent.change(getByTestId('name'), { target: { value: 'Dr. Watson' } })
    expect(getByTestId('name').value).toBe('Dr. Watson')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Mr. Hyde')
  })

  it("should NOT reinitialize when initialValues prop doesn't change (shallowly) but rerendered", () => {
    const { getByTestId, getByText } = render(
      <Toggle>
        {useAlternateInitialValues => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{
              name: 'Dr. Jekyll'
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('Dr. Jekyll')
    fireEvent.change(getByTestId('name'), { target: { value: 'Dr. Watson' } })
    expect(getByTestId('name').value).toBe('Dr. Watson')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Dr. Watson')
  })

  it('should reinitialize when initialValues prop changes, deeply', () => {
    const initialValues = {
      professor: {
        name: 'Dr. Jekyll'
      }
    }
    const alternateInitialValues = {
      professor: {
        name: 'Mr. Hyde'
      }
    }
    const { getByTestId, getByText } = render(
      <Toggle>
        {useAlternateInitialValues => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={
              useAlternateInitialValues ? alternateInitialValues : initialValues
            }
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="professor.name"
                  component="input"
                  data-testid="name"
                />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('Dr. Jekyll')
    fireEvent.change(getByTestId('name'), { target: { value: 'Dr. Watson' } })
    expect(getByTestId('name').value).toBe('Dr. Watson')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Mr. Hyde')
  })

  it('should not reinitialize if initialValues prop is deep equal', () => {
    const { getByTestId, getByText } = render(
      <Toggle>
        {useAlternateInitialValues => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{
              professor: {
                name: 'Dr. Jekyll'
              }
            }}
            initialValuesEqual={deepEqual}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="professor.name"
                  component="input"
                  data-testid="name"
                />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('Dr. Jekyll')
    fireEvent.change(getByTestId('name'), { target: { value: 'Dr. Watson' } })
    expect(getByTestId('name').value).toBe('Dr. Watson')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Dr. Watson')
  })

  it('should respect keepDirtyOnReinitialize prop when initialValues prop changes', () => {
    const initialValues = {
      name: 'Dr. Jekyll'
    }
    const alternateInitialValues = {
      name: 'Mr. Hyde'
    }
    const { getByTestId, getByText } = render(
      <Toggle>
        {useAlternateInitialValues => (
          <Form
            onSubmit={onSubmitMock}
            keepDirtyOnReinitialize
            initialValues={
              useAlternateInitialValues ? alternateInitialValues : initialValues
            }
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('Dr. Jekyll')
    fireEvent.change(getByTestId('name'), { target: { value: 'Dr. Watson' } })
    expect(getByTestId('name').value).toBe('Dr. Watson')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('Dr. Watson')
  })

  it('should update when onSubmit changes', () => {
    const firstOnSubmit = jest.fn()
    const secondOnSubmit = jest.fn()
    const { getByTestId, getByText } = render(
      <Toggle>
        {useAlternateOnSubmit => (
          <Form
            onSubmit={useAlternateOnSubmit ? secondOnSubmit : firstOnSubmit}
          >
            {({ handleSubmit }) => (
              <form data-testid="form" onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
                <button type="submit">Submit</button>
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    fireEvent.change(getByTestId('name'), { target: { value: 'Erik' } })
    expect(firstOnSubmit).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(firstOnSubmit).toHaveBeenCalled()
    expect(firstOnSubmit).toHaveBeenCalledTimes(1)
    expect(firstOnSubmit.mock.calls[0][0]).toEqual({
      name: 'Erik'
    })
    expect(secondOnSubmit).not.toHaveBeenCalled()
    fireEvent.click(getByText('Toggle'))
    expect(firstOnSubmit).toHaveBeenCalledTimes(1)
    expect(secondOnSubmit).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(firstOnSubmit).toHaveBeenCalledTimes(1)
    expect(secondOnSubmit).toHaveBeenCalled()
    expect(secondOnSubmit).toHaveBeenCalledTimes(1)
    expect(secondOnSubmit.mock.calls[0][0]).toEqual({
      name: 'Erik'
    })
  })

  it('should warn if decorators change', () => {
    const decoratorA = form => () => {}
    const decoratorB = form => () => {}
    const decoratorC = form => () => {}
    const oldDecorators = [decoratorA, decoratorB]
    const newDecorators = [decoratorA, decoratorB, decoratorC]
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { getByText } = render(
      <Toggle>
        {useAlternateDecorators => (
          <Form
            onSubmit={onSubmitMock}
            decorators={useAlternateDecorators ? newDecorators : oldDecorators}
          >
            {({ handleSubmit }) => (
              <form data-testid="form" onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
                <button type="submit">Submit</button>
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(errorSpy).not.toHaveBeenCalled()
    fireEvent.click(getByText('Toggle'))
    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith(
      'Form decorators should not change from one render to the next as new values will be ignored'
    )
    errorSpy.mockRestore()
  })

  it('should return a promise from handleSubmit when submission is async', () => {
    const { getByTestId, getByText } = render(
      <Form
        onSubmit={async () => {
          await timeout(2)
        }}
      >
        {({ handleSubmit }) => (
          <form
            data-testid="form"
            onSubmit={event => {
              const promise = handleSubmit(event)
              expect(promise).toBeDefined()
              expect(typeof promise.then).toBe('function')
            }}
          >
            <Field name="name" component="input" data-testid="name" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    fireEvent.change(getByTestId('name'), { target: { value: 'Erik' } })
    fireEvent.click(getByText('Submit'))
  })

  it('should ignore SyntheticEvents on form reset ', () => {
    const { getByTestId, getByText } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ name: 'John' }}>
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" component="input" data-testid="name" />
            <button type="button" onClick={form.reset}>
              Reset
            </button>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('name').value).toBe('John')
    fireEvent.change(getByTestId('name'), { target: { value: 'Paul' } })
    expect(getByTestId('name').value).toBe('Paul')
    fireEvent.click(getByText('Reset'))
    expect(getByTestId('name').value).toBe('John')
  })

  it('should accept new initial values on form reset ', () => {
    const { getByTestId, getByText } = render(
      <Form
        onSubmit={onSubmitMock}
        subscription={{}}
        initialValues={{ name: 'erikras' }}
      >
        {({ form }) => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <button type="button" onClick={() => form.reset({ name: 'bob' })}>
              Reset
            </button>
          </form>
        )}
      </Form>
    )
    expect(getByTestId('name').value).toBe('erikras')
    fireEvent.change(getByTestId('name'), {
      target: { value: 'erikrasmussen' }
    })
    expect(getByTestId('name').value).toBe('erikrasmussen')
    fireEvent.click(getByText('Reset'))
    expect(getByTestId('name').value).toBe('bob')
  })

  it('should use decorators, and unsubscribe them on unmount', () => {
    const unsubscribe = jest.fn()
    const decorator = jest.fn(() => unsubscribe)
    const { getByText } = render(
      <Toggle>
        {hideForm =>
          !hideForm && (
            <Form onSubmit={onSubmitMock} decorators={[decorator]}>
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="name" component="input" data-testid="name" />
                </form>
              )}
            </Form>
          )
        }
      </Toggle>
    )
    expect(decorator).toHaveBeenCalled()
    expect(decorator).toHaveBeenCalledTimes(1)
    expect(unsubscribe).not.toHaveBeenCalled()
    fireEvent.click(getByText('Toggle'))
    expect(unsubscribe).toHaveBeenCalled()
  })

  it('should all record level validation function to change', () => {
    const simpleValidation = values => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Required'
      }
      return errors
    }
    const complexValidation = values => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Required'
      } else if (values.name.toUpperCase() !== values.name) {
        errors.name = 'SHOULD BE SHOUTING'
      }
      return errors
    }
    const { getByTestId, getByText } = render(
      <Toggle>
        {useComplexValidation => (
          <Form
            onSubmit={onSubmitMock}
            subscription={{}}
            validate={
              useComplexValidation ? complexValidation : simpleValidation
            }
          >
            {() => (
              <form>
                <Field name="name" component="input">
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
    expect(getByTestId('name').value).toBe('')
    expect(getByTestId('error')).toHaveTextContent('Required')
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(getByTestId('error')).toHaveTextContent('')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('error')).toHaveTextContent('SHOULD BE SHOUTING')
    fireEvent.change(getByTestId('name'), { target: { value: 'ERIKRAS' } })
    expect(getByTestId('error')).toHaveTextContent('')
  })

  it('should show form as invalid on second rerender if field-level validation errors are present', () => {
    // Debugging https://github.com/final-form/react-final-form/issues/196
    const spy = jest.fn()
    render(
      <Form
        onSubmit={onSubmitMock}
        subscription={{ invalid: true }}
        initialValues={{ name: 'erik' }}
      >
        {({ handleSubmit, invalid }) => {
          spy(invalid)
          return (
            <form onSubmit={handleSubmit}>
              <Field
                name="name"
                component="input"
                validate={() => 'Required'}
              />
            </form>
          )
        }}
      </Form>
    )
    // On first render, we cannot know about any field level validation rules
    // because none of the fields have yet had a chance to render and register.
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[0][0]).toBe(false)
    expect(spy.mock.calls[1][0]).toBe(true)
  })

  it('should work with server-side rendering', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <Form
        onSubmit={onSubmitMock}
        render={() => (
          <form>
            <Field name="foo" component="input" type="text" />
          </form>
        )}
      />
    )
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('should allow change to debug flag', () => {
    // this is mostly for code coverage 😰
    const debugMock = jest.fn()
    const { getByText } = render(
      <Toggle>
        {debug => (
          <Form onSubmit={onSubmitMock} debug={debug ? debugMock : undefined}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    fireEvent.click(getByText('Toggle'))
  })

  it('should allow change to destroyOnUnregister flag', () => {
    // this is mostly for code coverage 😰
    const { getByText } = render(
      <Toggle>
        {destroyOnUnregister => (
          <Form
            onSubmit={onSubmitMock}
            destroyOnUnregister={destroyOnUnregister}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    fireEvent.click(getByText('Toggle'))
  })

  it('should allow change to keepDirtyOnReinitialize flag', () => {
    // this is mostly for code coverage 😰
    const { getByText } = render(
      <Toggle>
        {keepDirtyOnReinitialize => (
          <Form
            onSubmit={onSubmitMock}
            keepDirtyOnReinitialize={keepDirtyOnReinitialize}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    fireEvent.click(getByText('Toggle'))
  })

  it('should allow change to validateOnBlur flag', () => {
    // this is mostly for code coverage 😰
    const { getByText } = render(
      <Toggle>
        {validateOnBlur => (
          <Form onSubmit={onSubmitMock} validateOnBlur={validateOnBlur}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    fireEvent.click(getByText('Toggle'))
  })

  it('should allow change to mutators', () => {
    // this is mostly for code coverage 😰
    const oldMutators = undefined
    const newMutators = {
      clearField: ([name], state, { changeValue }) => {
        changeValue(state, name, () => undefined)
      }
    }
    const spy = jest.fn()
    const { getByTestId, getByText } = render(
      <Toggle>
        {swapMutators => (
          <Form
            onSubmit={onSubmitMock}
            mutators={swapMutators ? newMutators : oldMutators}
          >
            {wrapWith(spy, ({ handleSubmit, form }) => (
              <form onSubmit={handleSubmit}>
                <Field name="name" component="input" data-testid="name" />
                <button
                  type="button"
                  onClick={() => form.mutators.clearField('name')}
                >
                  Clear Name
                </button>
              </form>
            ))}
          </Form>
        )}
      </Toggle>
    )
    expect(getByTestId('name').value).toBe('')
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(getByTestId('name').value).toBe('erikras')
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('name').value).toBe('erikras')
    fireEvent.click(getByText('Clear Name'))
    expect(getByTestId('name').value).toBe('')
  })

  it("should allow handleSubmit to be called with an object that's not an event", () => {
    const onSubmitMock = jest.fn()
    const { getByText } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ name: 'erikras' }}>
        {({ handleSubmit }) => (
          <form
            onSubmit={event => {
              handleSubmit({})
              event.preventDefault() // so react-testing-library doesn't freak out
            }}
          >
            <Field name="name" component="input" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(onSubmitMock).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(onSubmitMock).toHaveBeenCalled()
    expect(onSubmitMock).toHaveBeenCalledTimes(1)
    expect(onSubmitMock.mock.calls[0][0]).toEqual({ name: 'erikras' })
  })

  it('should allow handleSubmit to be called with no parameters', () => {
    const onSubmitMock = jest.fn()
    const { getByText } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ name: 'erikras' }}>
        {({ handleSubmit }) => (
          <form
            onSubmit={event => {
              handleSubmit()
              event.preventDefault() // so react-testing-library doesn't freak out
            }}
          >
            <Field name="name" component="input" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    expect(onSubmitMock).not.toHaveBeenCalled()
    fireEvent.click(getByText('Submit'))
    expect(onSubmitMock).toHaveBeenCalled()
    expect(onSubmitMock).toHaveBeenCalledTimes(1)
    expect(onSubmitMock.mock.calls[0][0]).toEqual({ name: 'erikras' })
  })

  it('should set submitting back to false after submit', async () => {
    const onSubmit = jest.fn(async () => {
      await timeout(1)
    })
    const recordSubmitting = jest.fn()
    const { getByText } = render(
      <Form onSubmit={onSubmit} subscription={{ submitting: true }}>
        {({ handleSubmit, submitting }) => {
          recordSubmitting(submitting)
          return (
            <form onSubmit={handleSubmit}>
              <Field name="name" component="input" />
              <button type="submit">Submit</button>
            </form>
          )
        }}
      </Form>
    )
    expect(onSubmit).not.toHaveBeenCalled()
    expect(recordSubmitting).toHaveBeenCalled()
    expect(recordSubmitting).toHaveBeenCalledTimes(1)
    expect(recordSubmitting.mock.calls[0][0]).toBe(false)

    fireEvent.click(getByText('Submit'))

    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(recordSubmitting).toHaveBeenCalledTimes(2)
    expect(recordSubmitting.mock.calls[1][0]).toBe(true)

    await sleep(5)

    expect(recordSubmitting).toHaveBeenCalledTimes(3)
    expect(recordSubmitting.mock.calls[2][0]).toBe(false)
  })

  it('should allow an alternative form api to be passed in', () => {
    const onSubmit = jest.fn()
    const form = createForm({ onSubmit: onSubmit })
    const registerFieldSpy = jest.spyOn(form, 'registerField')
    const subscribeToFieldStateSpy = jest.spyOn(form, 'subscribeToFieldState')
    render(
      <Form form={form}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" component="input" />
          </form>
        )}
      </Form>
    )

    // called once on first render to register only once
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(registerFieldSpy.mock.calls[0][0]).toBe('name')
    expect(registerFieldSpy.mock.calls[0][1]).toBe(undefined) // no initial callback
    expect(registerFieldSpy.mock.calls[0][2]).toBe(undefined) // no subscription

    // subscribe to field state once
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy.mock.calls[0][0]).toBe('name')
    expect(subscribeToFieldStateSpy.mock.calls[0][2].active).toBe(true) // default subscription
  })

  it('should keep field states when field is hidden with keepFieldStateOnUnmount option', () => {
    const { getByTestId, getByText } = render(
      <Toggle>
        {hidden => (
          <Form initialValues={{ name: 'erikras' }} onSubmit={onSubmitMock}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {!hidden && (
                  <Field
                    keepFieldStateOnUnmount
                    name="name"
                    validate={v =>
                      v.toLowerCase() !== v ? 'SHOULD BE LOWERCASE' : undefined
                    }
                  >
                    {({ input, meta }) => (
                      <>
                        <input {...input} data-testid="name" />
                        <span data-testid="error">{meta.error}</span>
                      </>
                    )}
                  </Field>
                )}
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )

    const nameField = getByTestId('name')
    const errorElem = getByTestId('error')
    expect(nameField).toHaveValue('erikras')
    expect(errorElem).not.toHaveTextContent('SHOULD BE LOWERCASE')

    fireEvent.change(nameField, { target: { value: 'ERIKRAS' } })

    expect(nameField).toHaveValue('ERIKRAS')
    expect(errorElem).toHaveTextContent('SHOULD BE LOWERCASE')

    const toggleButton = getByText('Toggle')
    // hide
    fireEvent.click(toggleButton)
    expect(nameField).not.toBeInTheDocument()

    // show
    fireEvent.click(toggleButton)
    expect(nameField).toHaveValue('ERIKRAS')
    expect(errorElem).toHaveTextContent('SHOULD BE LOWERCASE')
  })

  it('should not re-register when hidden field becomes visible again with keepFieldStateOnUnmount option', () => {
    const onSubmit = jest.fn()
    const form = createForm({ onSubmit: onSubmit })
    const registerFieldSpy = jest.spyOn(form, 'registerField')
    const subscribeToFieldStateSpy = jest.spyOn(form, 'subscribeToFieldState')

    const { getByTestId, getByText } = render(
      <Toggle>
        {hidden => (
          <Form form={form} onSubmit={onSubmitMock}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {!hidden && (
                  <Field
                    component="input"
                    data-testid="name"
                    keepFieldStateOnUnmount
                    name="name"
                  />
                )}
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )

    const nameField = getByTestId('name')
    const toggleButton = getByText('Toggle')
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)

    // hide
    fireEvent.click(toggleButton)
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)

    // show
    fireEvent.click(toggleButton)
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(2)
  })

  it('should re-register with the name prop change', () => {
    const onSubmit = jest.fn()
    const form = createForm({ onSubmit: onSubmit })
    const registerFieldSpy = jest.spyOn(form, 'registerField')
    const subscribeToFieldStateSpy = jest.spyOn(form, 'subscribeToFieldState')

    const { getByTestId, getByText } = render(
      <Toggle>
        {isCat => (
          <Form form={form} onSubmit={onSubmitMock}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  component="input"
                  data-testid="name"
                  name={isCat ? 'cat' : 'dog'}
                />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )

    const nameField = getByTestId('name')
    const toggleButton = getByText('Toggle')
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)

    // change to the input field shouldn't trigger re-register
    fireEvent.change(nameField, { target: { value: 'Jon' } })
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)

    fireEvent.click(toggleButton)
    expect(registerFieldSpy).toHaveBeenCalledTimes(2)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(2)

    fireEvent.click(toggleButton)
    expect(registerFieldSpy).toHaveBeenCalledTimes(3)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(3)
  })

  it('should re-register with the name prop change with keepFieldStateOnUnmount', () => {
    const onSubmit = jest.fn()
    const form = createForm({ onSubmit: onSubmit })
    const registerFieldSpy = jest.spyOn(form, 'registerField')
    const subscribeToFieldStateSpy = jest.spyOn(form, 'subscribeToFieldState')

    const { getByTestId, getByText } = render(
      <Toggle>
        {isCat => (
          <Form form={form} onSubmit={onSubmitMock}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  component="input"
                  data-testid="name"
                  name={isCat ? 'cat' : 'dog'}
                  keepFieldStateOnUnmount
                />
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )

    const nameField = getByTestId('name')
    const toggleButton = getByText('Toggle')
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)

    // change to the input field shouldn't trigger re-register
    fireEvent.change(nameField, { target: { value: 'Jon' } })
    expect(registerFieldSpy).toHaveBeenCalledTimes(1)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(1)

    fireEvent.click(toggleButton)
    expect(registerFieldSpy).toHaveBeenCalledTimes(2)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(2)

    // this should change the name back to cat (or dog, whatever toggle toggles the toggle)
    // since the states weren't removed, registration should not happen again, but subscription to field will
    fireEvent.click(toggleButton)
    expect(registerFieldSpy).toHaveBeenCalledTimes(2)
    expect(subscribeToFieldStateSpy).toHaveBeenCalledTimes(3)
  })

  it('should not destroy on unregister on initial unregister', () => {
    // https://github.com/final-form/react-final-form/issues/523
    const { getByTestId } = render(
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ name: 'erikras' }}
        destroyOnUnregister
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" component="input" data-testid="name" />
          </form>
        )}
      </Form>
    )

    expect(getByTestId('name')).toBeDefined()
    expect(getByTestId('name').value).toBe('erikras')
    fireEvent.focus(getByTestId('name'))
    expect(getByTestId('name').value).toBe('erikras')
  })

  it('should not destroy on unregister on initial register/unregister of new field', () => {
    // https://github.com/final-form/react-final-form/issues/523
    const { getByTestId, queryByTestId, getByText } = render(
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ name: 'erikras', password: 'f1nal-f0rm-RULEZ' }}
        destroyOnUnregister
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" component="input" data-testid="name" />
            <Toggle>
              {showPassword =>
                showPassword && (
                  <Field
                    name="password"
                    component="input"
                    type="password"
                    data-testid="password"
                  />
                )
              }
            </Toggle>
          </form>
        )}
      </Form>
    )

    expect(getByTestId('name')).toBeDefined()
    expect(getByTestId('name').value).toBe('erikras')
    fireEvent.focus(getByTestId('name'))
    expect(getByTestId('name').value).toBe('erikras')
    expect(queryByTestId('password')).toBe(null)
    fireEvent.click(getByText('Toggle'))
    expect(getByTestId('password').value).toBe('f1nal-f0rm-RULEZ')
    fireEvent.focus(getByTestId('password'))
    expect(getByTestId('password').value).toBe('f1nal-f0rm-RULEZ')
  })
})
