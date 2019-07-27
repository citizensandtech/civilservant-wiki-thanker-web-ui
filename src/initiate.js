import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {getInitialData} from "./api";


class URLreceiver extends Component {
    componentWillMount() {
        const {setInitialData, match: {params}} = this.props;
        // get live data
        // console.log("params.lang params.userId are:", params.lang, params.userId)
        console.log("Initiate will mount. UserName", this.props.userName)

        // using whether or not usernamu is null as a proxy for whether data has been loaded yet
        if (this.props.userName) {
            console.log("I believe the user is already logged in because their user name is set.")
        }
        else {
            console.log("User name is null so I'm going to get initial data")
            getInitialData(params.lang, params.userId, setInitialData, this.props);
        }
    }

    render() {
        console.log("initiates condition is ,", this.props.condition)
        console.log("user name is  ,", this.props.userName)
        switch (this.props.condition) {
            case 'thank':
                return <Redirect push to={{pathname: `${this.props.serverSubDir}/thanker`}}/>;
            case 'activity':
                return <Redirect push to={{pathname: `${this.props.serverSubDir}/activity`}}/>;
            case null:
                return <div>Loading...</div>;
            default:
                return <Redirect push to={{pathname: `${this.props.serverSubDir}/error`}}/>
        }
    }
}


export default URLreceiver

