import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import 'jest-dom/extend-expect'
import { ErrorBoundary, Toggle, wrapWith } from './testUtils'
import Form from './ReactFinalForm'
import Field from './Field'
import FormSpy from './FormSpy'

const onSubmitMock = values => {}
const hasFormApi = props => {
  expect(props.form).toBeDefined()
  expect(typeof props.form.batch).toBe('function')
  expect(typeof props.form.blur).toBe('function')
  expect(typeof props.form.change).toBe('function')
  expect(typeof props.form.focus).toBe('function')
  expect(typeof props.form.initialize).toBe('function')
  expect(typeof props.form.reset).toBe('function')
}

describe('FormSpy', () => {
  afterEach(cleanup)

  it('should warn if not used inside a form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorSpy = jest.fn()
    render(
      <ErrorBoundary spy={errorSpy}>
        <FormSpy render={() => <div />} />
      </ErrorBoundary>
    )
    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy.mock.calls[0][0].message).toBe(
      'FormSpy must be used inside of a <Form> component'
    )
    console.error.mockRestore()
  })

  it('should allow subscribing to everything', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <FormSpy
              render={wrapWith(spy, () => (
                <div />
              ))}
            />
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(spy).toHaveBeenCalledTimes(2)
    hasFormApi(spy.mock.calls[0][0])
    expect(spy.mock.calls[0][0].dirty).toBe(false)
    expect(spy.mock.calls[0][0].errors).toEqual({})
    expect(spy.mock.calls[0][0].invalid).toBe(false)
    expect(spy.mock.calls[0][0].pristine).toBe(true)
    expect(spy.mock.calls[0][0].submitFailed).toBe(false)
    expect(spy.mock.calls[0][0].submitSucceeded).toBe(false)
    expect(spy.mock.calls[0][0].submitting).toBe(false)
    expect(spy.mock.calls[0][0].valid).toBe(true)
    expect(spy.mock.calls[0][0].validating).toBe(false)
    expect(spy.mock.calls[0][0].values).toEqual({})
    hasFormApi(spy.mock.calls[1][0])
    expect(spy.mock.calls[1][0].dirty).toBe(false)
    expect(spy.mock.calls[1][0].errors).toEqual({})
    expect(spy.mock.calls[1][0].invalid).toBe(false)
    expect(spy.mock.calls[1][0].pristine).toBe(true)
    expect(spy.mock.calls[1][0].submitFailed).toBe(false)
    expect(spy.mock.calls[1][0].submitSucceeded).toBe(false)
    expect(spy.mock.calls[1][0].submitting).toBe(false)
    expect(spy.mock.calls[1][0].valid).toBe(true)
    expect(spy.mock.calls[1][0].validating).toBe(false)
    expect(spy.mock.calls[1][0].values).toEqual({})

    // change value
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })

    expect(spy).toHaveBeenCalledTimes(3)
    hasFormApi(spy.mock.calls[2][0])
    expect(spy.mock.calls[2][0].dirty).toBe(true)
    expect(spy.mock.calls[2][0].errors).toEqual({})
    expect(spy.mock.calls[2][0].invalid).toBe(false)
    expect(spy.mock.calls[2][0].pristine).toBe(false)
    expect(spy.mock.calls[2][0].submitFailed).toBe(false)
    expect(spy.mock.calls[2][0].submitSucceeded).toBe(false)
    expect(spy.mock.calls[2][0].submitting).toBe(false)
    expect(spy.mock.calls[2][0].valid).toBe(true)
    expect(spy.mock.calls[2][0].validating).toBe(false)
    expect(spy.mock.calls[2][0].values).toEqual({ name: 'erikras' })
  })

  it('should NOT resubscribe if subscription changes', () => {
    const firstSubscription = { values: true, pristine: true }
    const secondSubscription = { dirty: true, submitting: true }
    const spy = jest.fn()
    const { getByText } = render(
      <Toggle>
        {useAlternateSubscription => (
          <Form
            onSubmit={onSubmitMock}
            initialValues={{ dog: 'Odie', cat: 'Garfield' }}
          >
            {() => (
              <form>
                <Field name="dog" component="input" />
                <Field name="cat" component="input" />
                <FormSpy
                  subscription={
                    useAlternateSubscription
                      ? secondSubscription
                      : firstSubscription
                  }
                >
                  {wrapWith(spy, props => (
                    <div />
                  ))}
                </FormSpy>
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(spy).toHaveBeenCalled()
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(spy).toHaveBeenCalledTimes(2)
    hasFormApi(spy.mock.calls[0][0])
    expect(spy.mock.calls[0][0].dirty).toBeUndefined()
    expect(spy.mock.calls[0][0].errors).toBeUndefined()
    expect(spy.mock.calls[0][0].invalid).toBeUndefined()
    expect(spy.mock.calls[0][0].pristine).toBe(true)
    expect(spy.mock.calls[0][0].submitFailed).toBeUndefined()
    expect(spy.mock.calls[0][0].submitSucceeded).toBeUndefined()
    expect(spy.mock.calls[0][0].submitting).toBeUndefined()
    expect(spy.mock.calls[0][0].valid).toBeUndefined()
    expect(spy.mock.calls[0][0].validating).toBeUndefined()
    expect(spy.mock.calls[0][0].values).toEqual({
      dog: 'Odie',
      cat: 'Garfield'
    })
    hasFormApi(spy.mock.calls[1][0])
    expect(spy.mock.calls[1][0].dirty).toBeUndefined()
    expect(spy.mock.calls[1][0].errors).toBeUndefined()
    expect(spy.mock.calls[1][0].invalid).toBeUndefined()
    expect(spy.mock.calls[1][0].pristine).toBe(true)
    expect(spy.mock.calls[1][0].submitFailed).toBeUndefined()
    expect(spy.mock.calls[1][0].submitSucceeded).toBeUndefined()
    expect(spy.mock.calls[1][0].submitting).toBeUndefined()
    expect(spy.mock.calls[1][0].valid).toBeUndefined()
    expect(spy.mock.calls[1][0].validating).toBeUndefined()
    expect(spy.mock.calls[1][0].values).toEqual({
      dog: 'Odie',
      cat: 'Garfield'
    })

    fireEvent.click(getByText('Toggle'))

    // one for new prop, and NOT again because no reregistering since v6
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('should hear changes', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <FormSpy subscription={{ dirty: true, values: true }}>
              {wrapWith(spy, props => (
                <div />
              ))}
            </FormSpy>
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(spy).toHaveBeenCalledTimes(2)
    hasFormApi(spy.mock.calls[0][0])
    expect(spy.mock.calls[0][0].dirty).toBe(false)
    expect(spy.mock.calls[0][0].errors).toBeUndefined()
    expect(spy.mock.calls[0][0].invalid).toBeUndefined()
    expect(spy.mock.calls[0][0].pristine).toBeUndefined()
    expect(spy.mock.calls[0][0].submitFailed).toBeUndefined()
    expect(spy.mock.calls[0][0].submitSucceeded).toBeUndefined()
    expect(spy.mock.calls[0][0].submitting).toBeUndefined()
    expect(spy.mock.calls[0][0].valid).toBeUndefined()
    expect(spy.mock.calls[0][0].validating).toBeUndefined()
    expect(spy.mock.calls[0][0].values).toEqual({})
    hasFormApi(spy.mock.calls[1][0])
    expect(spy.mock.calls[1][0].dirty).toBe(false)
    expect(spy.mock.calls[1][0].errors).toBeUndefined()
    expect(spy.mock.calls[1][0].invalid).toBeUndefined()
    expect(spy.mock.calls[1][0].pristine).toBeUndefined()
    expect(spy.mock.calls[1][0].submitFailed).toBeUndefined()
    expect(spy.mock.calls[1][0].submitSucceeded).toBeUndefined()
    expect(spy.mock.calls[1][0].submitting).toBeUndefined()
    expect(spy.mock.calls[1][0].valid).toBeUndefined()
    expect(spy.mock.calls[1][0].validating).toBeUndefined()
    expect(spy.mock.calls[1][0].values).toEqual({})

    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })

    expect(spy).toHaveBeenCalledTimes(3)
    hasFormApi(spy.mock.calls[2][0])
    expect(spy.mock.calls[2][0].dirty).toBe(true)
    expect(spy.mock.calls[2][0].errors).toBeUndefined()
    expect(spy.mock.calls[2][0].invalid).toBeUndefined()
    expect(spy.mock.calls[2][0].pristine).toBeUndefined()
    expect(spy.mock.calls[2][0].submitFailed).toBeUndefined()
    expect(spy.mock.calls[2][0].submitSucceeded).toBeUndefined()
    expect(spy.mock.calls[2][0].submitting).toBeUndefined()
    expect(spy.mock.calls[2][0].valid).toBeUndefined()
    expect(spy.mock.calls[2][0].validating).toBeUndefined()
    expect(spy.mock.calls[2][0].values).toEqual({ name: 'erikras' })
  })

  it('should unsubscribe on unmount', () => {
    // This is mainly here for code coverage. 🧐
    const spy = jest.fn()
    const { getByText } = render(
      <Toggle>
        {hidden => (
          <Form onSubmit={onSubmitMock}>
            {() => (
              <form>
                <Field name="name" component="input" />
                {!hidden && (
                  <FormSpy>
                    {wrapWith(spy, props => (
                      <div />
                    ))}
                  </FormSpy>
                )}
              </form>
            )}
          </Form>
        )}
      </Toggle>
    )
    expect(spy).toHaveBeenCalled()
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(spy).toHaveBeenCalledTimes(2)
    fireEvent.click(getByText('Toggle'))
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should call onChange', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <FormSpy
              subscription={{ dirty: true, values: true }}
              onChange={spy}
            />
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].dirty).toBe(false)
    expect(spy.mock.calls[0][0].errors).toBeUndefined()
    expect(spy.mock.calls[0][0].invalid).toBeUndefined()
    expect(spy.mock.calls[0][0].pristine).toBeUndefined()
    expect(spy.mock.calls[0][0].submitFailed).toBeUndefined()
    expect(spy.mock.calls[0][0].submitSucceeded).toBeUndefined()
    expect(spy.mock.calls[0][0].submitting).toBeUndefined()
    expect(spy.mock.calls[0][0].valid).toBeUndefined()
    expect(spy.mock.calls[0][0].validating).toBeUndefined()
    expect(spy.mock.calls[0][0].values).toEqual({})

    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[1][0].dirty).toBe(true)
    expect(spy.mock.calls[1][0].values).toEqual({ name: 'erikras' })
  })

  it('should not render with render prop when given onChange', () => {
    const spy = jest.fn()
    const renderSpy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <FormSpy
              subscription={{ dirty: true, values: true }}
              onChange={spy}
              render={render}
            />
          </form>
        )}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(renderSpy).not.toHaveBeenCalled()
  })

  it('should ignore SyntheticEvents on form reset ', () => {
    const { getByTestId, getByText } = render(
      <Form
        onSubmit={onSubmitMock}
        subscription={{}}
        initialValues={{ name: 'erikras' }}
      >
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <FormSpy subscription={{}}>
              {({ form }) => (
                <button type="button" onClick={form.reset}>
                  Reset
                </button>
              )}
            </FormSpy>
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
    expect(getByTestId('name').value).toBe('erikras')
  })

  it('should accept new initial values on form reset ', () => {
    const { getByTestId, getByText } = render(
      <Form
        onSubmit={onSubmitMock}
        subscription={{}}
        initialValues={{ name: 'erikras' }}
      >
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <FormSpy subscription={{}}>
              {({ form }) => (
                <button
                  type="button"
                  onClick={() => form.reset({ name: 'bob' })}
                >
                  Reset
                </button>
              )}
            </FormSpy>
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
})
