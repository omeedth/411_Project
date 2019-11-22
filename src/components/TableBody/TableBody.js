import React from 'react';
import ReactDOM from 'react-dom';

class TableBody extends React.Component {

    /* Add more functionality later */
    // 1. Table Data
    constructor(props) {
        super(props);
    }

    render() {
        return (Array.isArray(this.props.data)) ? (
            <tbody>
                {this.props.data.map((tr,index) => {
                    return (
                        <tr key={'r:'+index}>
                            {tr.map((tabledata,index) => {
                                return (
                                    <td key={index}>{tabledata}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        ) : null;
    }

}

export default TableBody;