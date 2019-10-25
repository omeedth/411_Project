import React from 'react';
import { hot } from 'react-hot-loader/root';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './content/LandingPage';
import { HashRouter as Router } from 'react-router-dom';

// Inside of your component's `render` method
function App() {
  return (
    <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="https://codingthesmartway.com" target="_blank">
              <img src={logo} width="30" height="30" alt="CodingTheSmartWay.com" />
            </a>
            <Link to="/" className="navbar-brand">MERN-Stack 411 App</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">LandingPage</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={LandingPage} />
        </div>
      </Router>
  );
}

export default hot(App);

/**
 * <>
      <Router>                
          <Switch>
            <Route exact path="/" component={LandingPage} />
          </Switch>        
      </Router>
    </>
 */