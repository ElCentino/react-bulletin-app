import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Note } from './Note'
import uuid from 'uuid/v1'
import { Panel } from './panel';
import reducers from '../store/reducers'
import { createStore } from 'redux'
import initialState from '../initialState'
import C from '../constants'

export class Board extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notes: []
    }

    this.store = createStore(reducers, initialState);
    this.store.subscribe(() => console.log(store.getState()));

    this.store.subscribe(() => {

      localStorage['redux-store'] = JSON.parse(this.state)
    });

    window.store = this.store;

  }

  componentWillMount() {

    if(this.props.count) {

      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/app/database/notes', true);
      xhr.onload = () => {

        const results = JSON.parse(xhr.responseText);

        results.forEach(sentences => this.add(false, sentences.note.substring(0, 70), sentences.id))
      };

      xhr.send();
    }

    this.sideBarState = this.toggler(false);
  }

  toggler(state) {

    var currentState = state;

    return () => currentState = !currentState;
  }

  logToServer(message) {

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/logs/bullettin/app', true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`message=${message}`);

  }

  nextId() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  }

  update(newText, i) {
    let arr = this.state.notes;
    arr[i].note = newText;
    this.setState({notes:arr});
  }

  remove(i, noteId) {

    let arr = this.state.notes;

    arr.splice(i, 1);

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/app/database/notes/${noteId}`, true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

    this.setState({notes: arr});
  }

  eachNote(note, i) {
    return (
      <Note key={note.id} index={i} noteId={note.noteId} onLog={this.logToServer.bind(this, "null")} onChange={this.update.bind(this)} onRemove={this.remove.bind(this)}>{note.note}</Note>
    );
  }

  addUnsavedDocument(id) {

    fetch('/app/database/notes', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `note=Unsaved Document&noteId=${id}`

    }).then(response => response.text()).then(text => {

      this.store.dispatch({
        type: C.ADD_NOTE,
        payload: {
          noteId: id,
          note: text
        }
      })
    }).catch(error => {

      this.store.dispatch({
        type: C.ADD_ERROR,
        payload: error
      })
    });
  }

  add(clicked, text, noteId) {
    let arr = this.state.notes;
    arr.push({
      id: this.nextId.call(this),
      noteId: noteId,
      note: text
    });

    this.setState({notes: arr});

    if(typeof clicked !== 'undefined' && clicked === true) {

      this.addUnsavedDocument.call(this, noteId);
    }

  }

  toggleSidebar() {

    var state = this.sideBarState().bind(this);

    if(state === true) {

      document.getElementById("side-bar").style.width = "250px";

      $(".board, button, .note").not("#side-bar").css("margin-left", "250px");
    } else {

      document.getElementById("side-bar").style.width = "0";
      $(".board, button").not("#side-bar").css("margin-left", "0");
    }
  }

  render() {

    return (
      <div className="board" id="board">
        <Panel image="/images/140.jpg" />
        {this.state.notes.map(this.eachNote.bind(this))}
        <button className="btn btn-info btn-sm float-left glyphicon glyphicon-th-large bt-expose" onClick={this.toggleSidebar}  style={{position:"fixed", marginTop: "10px", top: "10px", left: "10px"}}></button>
        <button className="btn btn-success btn-sm float-right glyphicon-plus" onClick={this.add.bind(this, true, "Unsaved Document", uuid())} style={{position:"fixed", marginTop: "10px"}}></button>
      </div>
    );
  }
}

Board.propTypes = {

  count: props => {

    if(Number.isNaN(props.count)) {

      return new Error(
        `The count property must be a number`
      );
    } else if (props.count >  100) {

      return new Error(
        `Creating ${props.count} notes is ridiculous`
      );
    }
  }
}
