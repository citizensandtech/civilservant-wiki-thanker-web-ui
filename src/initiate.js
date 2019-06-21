import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {getInitialData} from "./api";


class URLreceiver extends Component {
    componentWillMount() {
        const {setInitialData, match: {params}} = this.props;
        // get live data
        getInitialData(params.lang, params.userId, setInitialData);
    }

    render() {
        switch (this.props.condition) {
            case 'thank':
                return <Redirect to={{pathname: '/thanker'}}/>
            case 'activity':
                return <Redirect to={{pathname: '/activity'}}/>
            case null:
                return <div>Loading...</div>
            default:
                return <Redirect to={{pathname: '/error'}}/>
        }
    }
}


export default URLreceiver
