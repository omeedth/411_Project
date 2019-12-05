import React from 'react';
import ReactDOM from 'react-dom';


class FlightSegment extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {Object.keys(this.props.data).map((key,index) => {
                    return (
                        <div name={key} key={index}>
                            {( this.props.data[key] instanceof Object ?
                            Object.keys(this.props.data[key]).map((key,index) => {
                                return (<p key={index}><span className="bold">{key}:</span> {this.props.data[key]}</p>)
                            }) : null)}
                        </div>
                    )
                })}
            </div>
        );
    }

}

export default FlightSegment;