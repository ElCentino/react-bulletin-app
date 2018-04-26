import { createClass } from 'react'
import { render } from 'react-dom'
import { Note } from './Note'

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

  remove(i) {
    let arr = this.state.notes;

    arr.splice(i, 1);

    let newNotes = "";

    this.state.notes.forEach(note => {
      newNotes += note.note + "\n";
    });

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/app/database/notes', true);
    xhr.onload = () => alert(xhr.responseText);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`deleteReq=${newNotes}`);

    this.setState({notes: arr});
  },

  eachNote(note, i) {
    return (
      <Note key={note.id} index={i} onLog={this.logToServer.bind(null, "null")} onChange={this.update} onRemove={this.remove}>{note.note}</Note>
    );
  },

  componentWillMount() {

    const self = this;

    if(this.props.count) {

      const xhr = new XMLHttpRequest();
      // xhr.open('GET', 'https://baconipsum.com/api/?type=all-meat&sentences=' + this.props.count + '&start-with-lorem=1&callback=?', true);
      xhr.open('GET', '/app/database/notes', true);
      xhr.onload = () => {
        const results = xhr.responseText;

        results.split('\n').forEach(sentences =>  {
          if(!sentences.trim()) {
            return;
          } else {
            self.add(sentences.substring(0, 70));
          }
        });
      };

      xhr.send();
    }
  },

  add(text) {
    let arr = this.state.notes;
    arr.push({
      id: this.nextId(),
      note: text
    });
    this.setState({notes: arr});
  },

  render() {

    return (
      <div className="board">
        {this.state.notes.map(this.eachNote)}
        <button className="btn btn-success btn-sm float-right glyphicon-plus" onClick={this.add.bind(null, "New Text")} style={{position:"fixed", marginTop: "10px"}}></button>
      </div>
    );
  }
});
