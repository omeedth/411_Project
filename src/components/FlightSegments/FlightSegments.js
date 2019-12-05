import React from 'react';
import ReactDOM from 'react-dom';
import FlightSegment from '../FlightSegment/FlightSegment';

class FlightSegments extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {        
        return (
            <div>
                {this.props.data.map((datum,index) => {
                    return (
                        <FlightSegment key={index} data={datum} />
                    )
                })}
            </div>
        );
    }

}

export default FlightSegments;