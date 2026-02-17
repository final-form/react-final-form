/**
 * @jest-environment jsdom
 */
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
    
    // Verify all renders have name and value in sync
    const calls = renderSpy.mock.calls
    
    // Ensure Field actually rendered
    expect(calls.length).toBeGreaterThan(0)
    
    // All calls should have matching name/value pairs
    calls.forEach(call => {
      const [name, value] = call
      // Field name should only be 'a' or 'b'
      expect(name).toMatch(/^(a|b)$/)
      if (name === 'a') {
        expect(value).toBe('value-a')
      } else if (name === 'b') {
        expect(value).toBe('value-b')
      }
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
})
