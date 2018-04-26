import React from 'react'
import { createClass } from 'react'
import { render } from 'react-dom'
import { Board } from './components/Board'

window.React = React;

render (
  <Board count={50} />,
  document.getElementById('react-container')
);
