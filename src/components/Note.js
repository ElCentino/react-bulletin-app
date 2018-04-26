import { createClass } from 'react'
import { render } from 'react-dom'

export const Note = createClass ({

  getInitialState() {
    return {
      editing: false,
      edited: false
    }
  },

  componentWillMount() {
    this.style = {
      right: this.randomBetween(0, window.innerWidth - 180) + 'px',
      top: this.randomBetween(0, window.innerHeight - 180) + 'px',
      transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
    };
  },

  componentDidMount() {
    $(".draggable").draggable();
  },

  randomBetween(min, max) {
    return (min + Math.ceil(Math.random() * max));
  },

  edit() {

    if(this.state.edited === false) {
      this.props.onChange("", this.props.index);
    }

    this.setState({
      editing: true,
      edited: true
    });
  },

  save() {

    if(this.refs.newText.value === "" || this.refs.newText.value.length <= 0) {
      this.props.onChange("New Text", this.props.index);
    } else {
      this.props.onChange(this.refs.newText.value, this.props.index);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/app/database/notes', true);
    xhr.onload = () => alert(xhr.responseText);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`note=${this.refs.newText.value}`);

    this.setState({
      editing: false
    });
  },

  remove() {
    this.props.onRemove(this.props.index);
  },

  renderDisplay() {

    const {children} = this.props;

    return (

    <div className="note ui-widget-content draggable" style={this.style}>
      <p>{children}</p>
      <span>
        <button onClick={this.edit} className="btn btn-primary glyphicon glyphicon-pencil"></button>
        <button onClick={this.remove} className="btn btn-danger glyphicon glyphicon-trash"></button>
      </span>
    </div>
  )
  },

  renderForm() {
    return (
      <div className="note" style={this.style}>
        <textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea>
        <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-save"></button>
      </div>
    );
  },

  render() {
    if(this.state.editing) {
      return this.renderForm();
    } else {
      return this.renderDisplay();
    }
  }
});
