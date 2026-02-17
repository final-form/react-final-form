/**
 * @jest-environment jsdom
 */
// Tests for dynamic Field name changes (issue #869).
// Covers text inputs, checkboxes, and radio buttons.
import React from 'react'
import { render, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Form from './ReactFinalForm'
import Field from './Field'

describe('useField - Dynamic Name (Issue #869)', () => {
  afterEach(cleanup)

  it('should keep name and value in sync when field name changes', () => {
    const renderSpy = jest.fn()
    
    const TestComponent = ({ fieldName }) => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ a: 'value-a', b: 'value-b' }}
        >
          {() => (
            <Field name={fieldName}>
              {({ input }) => {
                // Log every render to track name/value sync
                renderSpy(input.name, input.value)
                return <input {...input} data-testid="field" />
              }}
            </Field>
          )}
        </Form>
      )
    }

    const { rerender } = render(<TestComponent fieldName="a" />)
    
    // Initial render - field 'a'
    expect(renderSpy).toHaveBeenCalledWith('a', 'value-a')
    
    renderSpy.mockClear()
    
    // Change field name from 'a' to 'b'
    act(() => {
      rerender(<TestComponent fieldName="b" />)
    })
    
    // Verify all renders after name change have name='b' and value='value-b'
    const calls = renderSpy.mock.calls
    
    // Ensure Field actually rendered
    expect(calls.length).toBeGreaterThan(0)
    
    // After rerender with fieldName="b", ALL calls should be for field 'b'
    calls.forEach(call => {
      const [name, value] = call
      expect(name).toBe('b')
      expect(value).toBe('value-b')
    })
  })

  it('should have correct value immediately after name change (no stale renders)', () => {
    const TestComponent = ({ fieldName }) => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ a: 'value-a', b: 'value-b' }}
        >
          {() => (
            <Field name={fieldName}>
              {({ input }) => (
                <div>
                  <span data-testid="name">{input.name}</span>
                  <span data-testid="value">{input.value}</span>
                </div>
              )}
            </Field>
          )}
        </Form>
      )
    }

    const { rerender, getByTestId } = render(<TestComponent fieldName="a" />)
    
    expect(getByTestId('name')).toHaveTextContent('a')
    expect(getByTestId('value')).toHaveTextContent('value-a')
    
    // Change field name
    act(() => {
      rerender(<TestComponent fieldName="b" />)
    })
    
    // Immediately after rerender, name and value should be in sync
    expect(getByTestId('name')).toHaveTextContent('b')
    expect(getByTestId('value')).toHaveTextContent('value-b')
  })

  it('should keep name and checked in sync when checkbox field name changes', () => {
    const renderSpy = jest.fn()
    
    const TestComponent = ({ fieldName }) => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ a: true, b: false }}
        >
          {() => (
            <Field name={fieldName} type="checkbox">
              {({ input }) => {
                // Log every render to track name/checked sync
                renderSpy(input.name, input.checked)
                return <input {...input} data-testid="field" />
              }}
            </Field>
          )}
        </Form>
      )
    }

    const { rerender } = render(<TestComponent fieldName="a" />)
    
    // Initial render - field 'a' checked
    expect(renderSpy).toHaveBeenCalledWith('a', true)
    
    renderSpy.mockClear()
    
    // Change field name from 'a' to 'b'
    act(() => {
      rerender(<TestComponent fieldName="b" />)
    })
    
    // Verify all renders after name change have name='b' and checked=false
    const calls = renderSpy.mock.calls
    
    // Ensure Field actually rendered
    expect(calls.length).toBeGreaterThan(0)
    
    // After rerender with fieldName="b", ALL calls should be for field 'b'
    calls.forEach(call => {
      const [name, checked] = call
      expect(name).toBe('b')
      expect(checked).toBe(false)
    })
  })

  it('should have correct checked immediately after checkbox name change', () => {
    const TestComponent = ({ fieldName }) => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ a: true, b: false }}
        >
          {() => (
            <Field name={fieldName} type="checkbox">
              {({ input }) => (
                <div>
                  <span data-testid="name">{input.name}</span>
                  <span data-testid="checked">{String(input.checked)}</span>
                </div>
              )}
            </Field>
          )}
        </Form>
      )
    }

    const { rerender, getByTestId } = render(<TestComponent fieldName="a" />)
    
    expect(getByTestId('name')).toHaveTextContent('a')
    expect(getByTestId('checked')).toHaveTextContent('true')
    
    // Change field name
    act(() => {
      rerender(<TestComponent fieldName="b" />)
    })
    
    // Immediately after rerender, name and checked should be in sync
    expect(getByTestId('name')).toHaveTextContent('b')
    expect(getByTestId('checked')).toHaveTextContent('false')
  })

  it('should keep name and checked in sync when radio field name changes', () => {
    const renderSpy = jest.fn()
    
    const TestComponent = ({ fieldName }) => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ a: 'option1', b: 'option2' }}
        >
          {() => (
            <Field name={fieldName} type="radio" value="option2">
              {({ input }) => {
                // Log every render to track name/checked sync
                renderSpy(input.name, input.checked)
                return <input {...input} data-testid="field" />
              }}
            </Field>
          )}
        </Form>
      )
    }

    const { rerender } = render(<TestComponent fieldName="a" />)
    
    // Initial render - field 'a' has value 'option1', not checked for 'option2'
    expect(renderSpy).toHaveBeenCalledWith('a', false)
    
    renderSpy.mockClear()
    
    // Change field name from 'a' to 'b'
    act(() => {
      rerender(<TestComponent fieldName="b" />)
    })
    
    // Verify all renders after name change have name='b' and checked=true
    const calls = renderSpy.mock.calls
    
    // Ensure Field actually rendered
    expect(calls.length).toBeGreaterThan(0)
    
    // After rerender with fieldName="b", ALL calls should be for field 'b'
    // Field 'b' has value 'option2', so radio with value="option2" should be checked
    calls.forEach(call => {
      const [name, checked] = call
      expect(name).toBe('b')
      expect(checked).toBe(true)
    })
  })

  it('should have correct checked immediately after radio name change', () => {
    const TestComponent = ({ fieldName }) => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ a: 'option1', b: 'option2' }}
        >
          {() => (
            <Field name={fieldName} type="radio" value="option2">
              {({ input }) => (
                <div>
                  <span data-testid="name">{input.name}</span>
                  <span data-testid="checked">{String(input.checked)}</span>
                </div>
              )}
            </Field>
          )}
        </Form>
      )
    }

    const { rerender, getByTestId } = render(<TestComponent fieldName="a" />)
    
    expect(getByTestId('name')).toHaveTextContent('a')
    expect(getByTestId('checked')).toHaveTextContent('false')
    
    // Change field name
    act(() => {
      rerender(<TestComponent fieldName="b" />)
    })
    
    // Immediately after rerender, name and checked should be in sync
    expect(getByTestId('name')).toHaveTextContent('b')
    expect(getByTestId('checked')).toHaveTextContent('true')
  })
})
