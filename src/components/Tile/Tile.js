import React from 'react';
import ReactDOM from 'react-dom';

class Tile extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="tile_wrapper">
                {this.props.data.map((datum,index) => {
                    return datum
                })}
            </div>
        );
    }

}

export default Tile;