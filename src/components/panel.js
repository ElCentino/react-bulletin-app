import { createClass } from 'react'
import { Board } from './Board'

export const Panel = createClass({

    render() {

        return (

            <div className="panel-side-bar" id="side-bar">
                <div className="user-section">
                    <img src={this.props.image} alt="user icon" className="rounded-circle user-icon" />
                    <h1 className="user-name">Elcentino</h1> 
                </div>
                <div className="panel-container">
                    <ul className="panel-buttons">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Reset Board</a></li>
                        <li><a href="#">Settings</a></li>
                    </ul>
                </div>
            </div>
        );
    }
});