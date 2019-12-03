import React from 'react';
import ReactDOM from 'react-dom'

import './_overrides.scss';

import { Route } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';

import FlightSegments from '../../components/FlightSegments/FlightSegments';
import FacebookButton from '../../components/FacebookButton/FacebookButton';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    rightToolbar: {
        marginLeft: 'auto',
        marginRight: -12,
    },
    title: {
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
}));



function classes() {
    useStyles();
    return null;
}

class LandingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: '',
            data: [],
            origin: '',
            destination: '',
            departure: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        /* Styles */           
        // this.classes = useStyles();    

        /* Classes */         
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

        fetch('/amadeus/lowfare',{
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
            
            var data = []
            response.data.forEach((flightOffer) => {
                var datum = {}
                flightOffer.offerItems.forEach((service) => {
                    service.services.forEach((segment) => {
                        segment.segments.forEach((flight) => {
                            Object.keys(flight.flightSegment).forEach((key) => {
                                datum[key] = flight.flightSegment[key];
                            })
                            // datum['pricingDetailPerAdult'] = flight.flightSegment.pricingDetailPerAdult;
                            // pricingDetailPerAdult
                            //  - travelClass
                            //  - fareClass
                            //  - availability
                            //  - fareBasis
                        })                                             
                    })
                    // console.log(service)
                    datum['pricePerAdult'] = service.pricePerAdult;
                    // price
                    //  - total
                    //  - totalTaxes
                    // pricePerAdult
                    //  - total
                    //  - totalTaxes                  
                })
                data.push(datum);
            });

            // console.log(data)
            this.setState({data});

        }).catch((err) => {
            console.log(err)
            this.setState({data: []});
        })

        // Convert Data into a list format before inputting into the Table

    }

    render() {
        return (
            // <div className="container">
            //     <h1>Our 411 Dashboard</h1>
            //     <FacebookButton />
            //     <form onSubmit={this.handleSubmit}>
            //         <input type="text" name="origin" value={this.state.origin} onChange={this.handleChange} />
            //         <input type="text" name="destination" value={this.state.destination} onChange={this.handleChange} />
            //         <input type="text" name="departure" value={this.state.departure} onChange={this.handleChange} />
            //         <input type="submit" value="Submit" />
            //     </form>
            //     <FlightSegments data={this.state.data} />
            //     {/* <p>{this.state.data}</p> */}
            //     {/* Example Below on how to add data into a Table Component */}
            //     {/* <Table headers={this.state.headers} data={this.state.data}></Table> */}
            //     {/* <Table headers={['header 1','header 2','header 3']} data={[['r1 d1','r1 d2','r1 d3'],['r2 d1','r2 d2','r2 d3'],['r3 d1','r3 d2','r3 d3']]}></Table> */}
            // </div>
            <>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={""} color="inherit" aria-label="menu">
                        <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={""}>
                        411 Dashboard
                        </Typography>
                        <section className={classes.rightToolbar}>
                            <IconButton color="inherit" aria-label="Save">
                                <SaveIcon />
                            </IconButton>
                            <IconButton color="inherit" aria-label="More Options">
                                <MoreVertIcon />
                            </IconButton>
                            <Button color="inherit">Login</Button>
                        </section>
                    </Toolbar>
                </AppBar>
                {/*<Container spacing={0} classes={{ root: 'no-padding' }} className={""}>
                    <Grid> */}
                        {/* This is where the body of the page begins! */}
                        {/*<Button color="primary" onClick={() => {fetch('/auth/facebook',{crossDomain:true,}).then(res => res.json()).then(data => console.log('Data:',data)).catch(err => {console.log('Error:',err)})}}>Facebook Login</Button>
                    </Grid>*/}
                {/*</Container>*/}

                {/*Start and End Location Forms */}
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Start Location" />
                    <TextField id="standard-basic" label="End Location" />
                </form>

                {/* Date and Time pickers */}
                <form className={classes.container} noValidate>
                    <TextField
                        id="date"
                        label="Start Date"
                        type="date"
                        defaultValue="2019-01-01"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="date"
                        label="End Date"
                        type="date"
                        defaultValue="2019-01-01"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>

                <Button color="primary">Submit</Button>
            </>          
        );
    }
}

export default LandingPage;
