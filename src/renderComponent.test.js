import renderComponent from './renderComponent'

describe('renderComponent', () => {
  it('should pass both render and children prop', () => {
    const children = 'some children'
    const render = () => {}
    const props = {
      component: () => null,
      children,
      render
    }
    const name = 'TestComponent'
    const result = renderComponent(props, name)
    expect(result.props).toEqual({ children, render })
  })
})
