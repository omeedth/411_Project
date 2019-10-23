import React from 'react';
import ReactDOM from 'react-dom';

import TableHeader from '../TableHeader/index';
import TableBody from '../TableBody/index';

class Table extends React.Component {

    /* Add more functionality later */
    // 1. Headers
    // 2. Table Data
    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers, // Optional
            data: props.data, // Mandatory
        }
    }

    render() {
        return (
            <table>
                {this.state.headers ? <TableHeader headers={this.state.headers} /> : null}
                <TableBody data={this.state.data} />
            </table>
        );
    }

}

export default Table;