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
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

import FlightSegments from '../../components/FlightSegments/FlightSegments';
import FacebookButton from '../../components/FacebookButton/FacebookButton';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(8, 0, 6),
    },
    menuButton: {
        marginRight: 16,
        marginLeft: -12,
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
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
        },
        li: {
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

function classes() {
    useStyles();
    return null;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                411 Project Website made with Material-UI
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

class LandingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            origin: '',
            destination: '',
            departure: '',
            data: [],
            price: [],
            location: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitYelp = this.handleSubmitYelp.bind(this);

        /* Styles */
        // this.classes = useStyles();    

        /* Classes */
    }

    handleChange(event) {
        // console.log(event.target.name);
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log('A request to Amadeus was submitted');

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

        fetch('/amadeus/lowfare', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.amadeus+json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(bodyData) // body data type must match "Content-Type" header
        }).then(results => results.json()).then((response) => {
            var data = []
            var price = []
            console.log(response.data)
            response.data.forEach((flightOffer) => {
                price.push(flightOffer.offerItems[0].price.total);
            })
            data.push(price);

            console.log(data)
            this.setState({ data });

        }).catch((err) => {
            console.log(err)
            this.setState({ data: [] });
            this.setState({ price: [] });
        })

        // Convert Data into a list format before inputting into the Table

    }

    handleSubmitYelp(event) {
        event.preventDefault();

        console.log('A request to YELP was submitted');

        fetch('/test').then((data) => {
            console.log(data)
        }).catch((err) => {

        })

        var uri = 'https://api.yelp.com/v3/businesses/search';
        var location = this.state.location;

        var bodyData = {
            uri: uri,
            location: location,
        }

        fetch('/yelp/businesses/search', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.amadeus+json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(bodyData) // body data type must match "Content-Type" header
        }).then((data) => {

            console.log(data);

        }).catch((err) => {
            console.log(err)
            this.setState({ data: [] });
        })

    }

    createTable = () => {
        return (
            <ol>
                {this.state.data.map(value => (
                    <li key={value}>{value}</li>
                ))}
            </ol>
        );
    }



    render() {
        return (
            <>

                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={""} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={""}>
                            411 Dashboard
                        </Typography>
                        <IconButton color="inherit" aria-label="Save" align="right">
                            <SaveIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="More Options" align="right">
                            <MoreVertIcon />
                        </IconButton>
                        <FacebookButton />
                    </Toolbar>
                </AppBar>

                {/* Hero unit */}
                <Container maxWidth="sm" component="main" className={classes.heroContent}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Travel Aid
        </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" component="p">
                        An easy to use web application that can help you find the cheapest flights instantly, along with finding the best tourist attractions and buisnesses to visit at your destination!
        </Typography>
                </Container>
                {/* End hero unit */}

                {/* Form For Low Flight Fare */}
                <form className={classes.root} noValidate autoComplete="off" onSubmit={this.handleSubmit} align="center">
                    {/*Start and End Location Forms */}
                    <TextField id="standard-basic" name="origin" value={this.state.origin} onChange={this.handleChange} label="Start Location" />
                    <TextField id="standard-basic" name="destination" value={this.state.destination} onChange={this.handleChange} label="End Location" />

                    {/* Date and Time pickers */}
                    <TextField
                        id="date"
                        name="departure"
                        value={this.state.departure}
                        onChange={this.handleChange}
                        label="Start Date"
                        type="date"
                        defaultValue="2019-01-01"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    {/* Submit Button */}
                    <Button type="submit" value="Submit" color="primary">Submit</Button>

                </form>


                <form className={classes.root} noValidate autoComplete="off" onSubmit={this.handleSubmitYelp} align="center">
                    {/*Start and End Location Forms */}
                    <TextField name="location" value={this.state.location} onChange={this.handleChange} label="Address" />

                    {/* Submit Button */}
                    <Button type="submit" value="Submit" color="primary">Submit</Button>

                </form>

                {this.createTable()}

                {/* Footer */}
                <Container maxWidth="md" component="footer" className={classes.footer}>
                    <Grid container spacing={4} justify="space-evenly">
                        {footers.map(footer => (
                            <Grid item xs={6} sm={3} key={footer.title}>
                                <Typography variant="h6" color="textPrimary" gutterBottom>
                                    {footer.title}
                                </Typography>
                                <ul>
                                    {footer.description.map(item => (
                                        <li key={item}>
                                            <Link href="#" variant="subtitle1" color="textSecondary">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Container>
                {/* End footer */}

            </>
        );
    }
}

export default LandingPage;
