import React, { Component } from 'react'
import "./input.css"

class Input extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input__component">
                {/* <textarea type="text" placeholder="Message" value={this.state.inputVal} onChange={this.onInputChange}></textarea> */}
                <input type="text" onChange={(event) => { this.props.onChange(event.target.value) }}></input>
            </div>
        )
    }
}

export default Input
