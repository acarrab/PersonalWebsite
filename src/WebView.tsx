import { darkBaseTheme, getMuiTheme, MuiThemeProvider } from "material-ui/styles";
import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

const darkMuiTheme = getMuiTheme(darkBaseTheme);

class InfoLink extends Link {
    render() {
        return (
            <div>

            </div>
        );
    }
}

class ProjectsLink extends React.Component {
    render() {
        return (
            <ul className="dropdown-menu">
                <li><Link to="/projects/personal-website"></Link></li>
            </ul>
        )
    }
}

class NavigationBar extends React.Component {
    public render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navLinks" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="#">Angelo Carrabba</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="navLinks">
                        <ul className="nav navbar-nav">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/projects">Projects</Link></li>
                            <li><Link to="/info">Info</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}





class Home extends React.Component {
    public render() {
        return (
            <div>Home</div>
        );
    }
}

class About extends React.Component {
    public render() {
        return (
            <div>About</div>
        );
    }
}

class Contact extends React.Component {
    public render() {
        return (
            <div>Contact</div>
        );
    }
}

class Projects extends React.Component {
    public render() {
        return (
            <div>Projects</div>
        );
    }
}

class Info extends React.Component {
    public render() {
        return (
            <div>Info</div>
        );
    }
}



class RouteTemplate extends React.Component {
    render() {
        return (
            <div>
            </div>
        );
    }
}


export default class WebView extends React.Component {
    public render() {
        return (
            <div>
                <Router>
                    <div className="MainContent">
                        <NavigationBar />
                        <Route path="/" component={Home} />
                        <Route path="/about" component={About} />
                        <Route path="/contact" component={Contact} />
                        <Route path="/projects" component={Projects} />
                        <Route path="/projects/personal-website" component={Projects} />
                        <Route path="/info" component={Info} />
                    </div>
                </Router>
            </div >
        );
    }
}
