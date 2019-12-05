import React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.scss';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './content/LandingPage';
import { HashRouter as Router } from 'react-router-dom';

// Inside of your component's `render` method
function App() {
  return (
    <>
      <Router>                
          <Switch>
            <Route exact path="/" component={LandingPage} />
            {/* <Route exact path="" component={}/> */}
          </Switch>        
      </Router>
    </>
  );
}

export default hot(App);
