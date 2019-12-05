import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

class FacebookButton extends React.Component {

    constructor(props) {
        super(props);
    }

    responseFacebook = async (response) => {
        console.log(response);
        if (response.status != 'unknown') {
            console.log('Successful!')

            var bodyData = {
                response: response,
            }

            fetch('/firebase/add',{
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.amadeus+json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(bodyData) // body data type must match "Content-Type" header
            })
        } else {
            console.log('Failed!') 
        }      
    }

    render() {
        return (
            <FacebookLogin
                appId="956629968045684"                
                fields="name,email,picture"
                autoLoad={true}
                callback={this.responseFacebook
                } />
        );
    }

}

export default FacebookButton;