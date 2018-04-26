import { createClass } from 'react'
import { render } from 'react-dom'
import React from 'react'

export const Box = createClass({

  getDefaultProps() {
    return {
      colorIndex: -1
    }

  },

  getInitialState() {
    return {
      backgroundColor: 'blue',
      width: 200,
      height: 200
    };
  },

  update() {
    this.setProps({colorIndex : this.props.colorIndex + 1});
  },

  componentsWillReceiveProps(nextProps) {
    const colors = this.props.colors.split(",")[nextProps.nextIndex];
    if(!color) {
      this.setProps({colorIndex: 0});
    }

    this.setState({backgroundColor: color});
  },

  render() {
    return (

        <div colors="red, yellow, green, brown" style={this.state} onClick={this.update}></div>

    );
  },

  unmount() {
    React.unmountComponentAtNode(document.body);
    alert("Component is unmounted");
  }
});
