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
    
    // BUG: First render after name change has mismatched name/value
    // We get name='b' but value='value-a' (stale)
    const calls = renderSpy.mock.calls
    
    // The bug manifests as: first call has name='b' but value='value-a'
    // Expected: ALL calls should have name and value in sync
    calls.forEach(call => {
      const [name, value] = call
      if (name === 'a') {
        expect(value).toBe('value-a')
      } else if (name === 'b') {
        expect(value).toBe('value-b')  // This will FAIL on first render
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
    
    // IMMEDIATELY after rerender, name and value should be in sync
    expect(getByTestId('name')).toHaveTextContent('b')
    expect(getByTestId('value')).toHaveTextContent('value-b')  // BUG: This will show 'value-a'
  })
})
