import React from 'react';
import ReactDOM from 'react-dom';

class TableHeader extends React.Component {

    /* Add more functionality later */
    // 1. Headers    
    constructor(props) {
        super(props);
    }

    render() {

        return (Array.isArray(this.props.headers)) ? (
            <thead>
                <tr>
                    {this.props.headers.map((header, index) => {
                        return <th key={index}>{header}</th>
                    })}
                </tr>
            </thead>
        ) : null;
    }

}

export default TableHeader;