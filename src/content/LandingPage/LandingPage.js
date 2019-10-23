import React from 'react';
import ReactDOM from 'react-dom'

import Table from '../../components/Table/Table';

class LandingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: '',
            origin: '',
            destination: '',
            departure: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // console.log(event.target.name);
        this.setState({[event.target.name]: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();

        console.log('A request was submitted');  

        var uri = 'https://test.api.amadeus.com/v1/shopping/flight-offers?origin=MAD&destination=PAR&departureDate=2019-08-01&returnDate=2019-08-28';
        var origin = this.state.origin;
        var destination = this.state.destination;
        var departureDate = this.state.departure;
        var returnDate = ''; // Optional
        var nonStop = ''; // Optional

        var bodyData = {
            // uri: uri,
            origin: origin,
            destination: destination,
            departureDate: departureDate
        }

        fetch('/api/post',{
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.amadeus+json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(bodyData) // body data type must match "Content-Type" header
        }).then(res => res.json()).then((response) => {                    
            this.setState({data: JSON.stringify(response.data)});
            console.log(response.data);
            for(var key in response.data) {
                console.log('Key: ' + key);
                console.log('Value: ' + response.data[key]);
                console.log('--------------------------------')
            }
        }).catch((err) => {
            console.log(err)
            this.setState({data: "{}"});
        })

        // Convert Data into a list format before inputting into the Table


    }

    render() {
        return (
            <div className="container">
                <h1>Our 411 Dashboard</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="origin" value={this.state.origin} onChange={this.handleChange} />
                    <input type="text" name="destination" value={this.state.destination} onChange={this.handleChange} />
                    <input type="text" name="departure" value={this.state.departure} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                <p>{this.state.data}</p>
                {/* Example Below on how to add data into a Table Component */}
                <Table headers={['header 1','header 2','header 3']} data={[['r1 d1','r1 d2','r1 d3'],['r2 d1','r2 d2','r2 d3'],['r3 d1','r3 d2','r3 d3']]}></Table>
            </div>
        );
    }
}

export default LandingPage;
