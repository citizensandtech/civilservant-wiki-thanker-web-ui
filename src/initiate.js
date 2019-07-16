import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {getInitialData} from "./api";


class URLreceiver extends Component {
    componentWillMount() {
        const {setInitialData, match: {params}} = this.props;
        // get live data
        getInitialData(params.lang, params.userId, setInitialData, this.props);
    }

    render() {
        switch (this.props.condition) {
            case 'thank':
                return <Redirect to={{pathname: `${this.props.serverSubDir}/thanker`}}/>;
            case 'activity':
                return <Redirect to={{pathname: `${this.props.serverSubDir}/activity`}}/>;
            case null:
                return <div>Loading...</div>;
            default:
                return <Redirect to={{pathname: `${this.props.serverSubDir}/error`}}/>
        }
    }
}


export default URLreceiver

