import React from "react";
import { Link } from "react-router-dom";
import Pages from "../pages/Pages";


interface ActiveLinkInput {
    title?: string;
    to: string;
}
interface ActiveLinkState {
    title: string;
    isActive: boolean;
}


// not well tested yet
class ActiveLink extends React.Component<ActiveLinkInput> {
    route: string;
    to: string;
    state: ActiveLinkState;

    routeSubscriptionId: number;
    
    constructor(props: ActiveLinkInput) {
        super();
        let title:string;
        if (props.title === undefined) {
            title = props.to
                .replace("/", " ")
                .replace(/\s\S+/, (s): string => (
                    s.slice(1, 2).toUpperCase() + s.slice(2)
                ))
                .trim();
        } else {
            title = props.title;
        }
        this.state = {
            title: title,
            isActive: Pages.getInstance().getCurrentRoute() === props.to
        }
    }
    componentDidMount() {
        this.routeSubscriptionId = Pages.getInstance().subscribeToRoute(this.props.to, this.myRouteChange.bind(this));
    }
    myRouteChange(isActive:boolean) {
        this.setState({isActive: isActive});
    }
    componentWillReceiveProps() {
        if (this.props.title !== undefined && this.props.title !== this.state.title) {
            this.setState({ title: this.props.title });
        }
    }
    render() {
        return (<li className={this.state.isActive ? "active" : ""}><Link to={this.props.to}>{this.state.title}</Link></li>)
    }
}

class NavigationLinks extends React.Component {
    public render() {
        return (
            <ul className="nav navbar-nav">
                <ActiveLink to="/" title="Home"/>
                <ActiveLink to="/about" />
                <ActiveLink to="/contact" />
                <ActiveLink to="/test1" />
                <ActiveLink to="/test2" />
                <ActiveLink to="/test3" />
                <ActiveLink to="/test4" />
                <ActiveLink to="/test5" />
            </ul>
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

export default class NavigationBar extends React.Component {
    public render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navLinks" aria-expanded="false">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="/">Angelo Carrabba</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="navLinks">
                        < NavigationLinks />
                    </div>
                </div>
            </nav>
        );
    }
}