import { createClass } from 'react'
import { render } from 'react-dom'
import { Note } from './Note'
import uuid from 'uuid/v1'

export const Board = createClass({

  propTypes: {
    count(props, propName) {
      if(typeof props[propName] !== "number") {
        return new Error('The count property must be a number');
      }

      if(props[propName] > 100) {
        return new Error(`Creating ${props[propName]} notes is ridiculous`);
      }
    }
  },

  getInitialState() {
    return {
      notes: [
      ]
    };
  },

  logToServer(message) {

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/logs/bullettin/app', true);
    xhr.onload = () => {

    };

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`message=${message}`);

  },

  nextId() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  },

  update(newText, i) {
    let arr = this.state.notes;
    arr[i].note = newText;
    this.setState({notes:arr});
  },

  remove(i, noteId) {
    let arr = this.state.notes;

    arr.splice(i, 1);

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/app/database/notes/${noteId}`, true);
    xhr.onload = () => alert(xhr.responseText);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

    this.setState({notes: arr});
  },

  eachNote(note, i) {
    return (
      <Note key={note.id} index={i} noteId={note.noteId} onLog={this.logToServer.bind(null, "null")} onChange={this.update} onRemove={this.remove}>{note.note}</Note>
    );
  },

  componentWillMount() {

    if(this.props.count) {

      const xhr = new XMLHttpRequest();
      // xhr.open('GET', 'https://baconipsum.com/api/?type=all-meat&sentences=' + this.props.count + '&start-with-lorem=1&callback=?', true);
      xhr.open('GET', '/app/database/notes', true);
      xhr.onload = () => {

        const results = JSON.parse(xhr.responseText);

        results.forEach(sentences =>  {

          this.add(false, sentences.note.substring(0, 70), sentences.id);
        });
      };

      xhr.send();
    }
  },


  addUnsavedDocument(id) {

    fetch('/app/database/notes', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `note=Unsaved Document&noteId=${id}`

    }).then(response => response.text()).then(text => alert(text)).catch(error => alert(error));
  },
  
  add(clicked, text, noteId) {
    let arr = this.state.notes;
    arr.push({
      id: this.nextId(),
      noteId: noteId,
      note: text
    });

    console.log(noteId);

    this.setState({notes: arr});

    if(typeof clicked !== 'undefined' && clicked === true) {

      this.addUnsavedDocument(noteId);
    }

  },

  render() {

    return (
      <div className="board">
        {this.state.notes.map(this.eachNote)}
        <button className="btn btn-success btn-sm float-right glyphicon-plus" onClick={this.add.bind(null, true, "Unsaved Document", uuid())} style={{position:"fixed", marginTop: "10px"}}></button>
      </div>
    );
  }
});
