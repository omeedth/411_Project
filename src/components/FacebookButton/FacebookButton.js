import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

class FacebookButton extends React.Component {

    constructor(props) {
        super(props);
    }

    responseFacebook = (response) => {
        console.log(response);
    }

    render() {
        return (
            <FacebookLogin
                appId="956629968045684"                
                fields="name,email,picture"
                autoLoad={true}
                callback={this.responseFacebook} />
        );
    }

}

export default FacebookButton;