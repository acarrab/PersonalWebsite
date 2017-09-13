import React from "react";
import { Link } from "react-router-dom";


class ProjectsLink extends React.Component {
    render() {
        return (
            <ul className="dropdown-menu">
                <li><Link to="/projects/personal-website"></Link></li>
            </ul>
        )
    }
}

export default class NavigationBar extends React.Component {
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