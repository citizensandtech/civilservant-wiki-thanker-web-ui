import React, {Component} from 'react';
import {Redirect} from "react-router-dom";


class URLreceiver extends Component {
    constructor(props) {
        super(props);
        this.state={condition:null}
    }
    componentWillMount() {
        const {setLang, setUserId, setCondition, match: {params}} = this.props;
        console.log('params', params)
        setLang(params.lang)
        setUserId(params.userId)
        setCondition(params.condition)
        this.setState({condition: params.condition})
    }

    render() {
        let nextPath = ''
        console.log('condition is,', this.state.condition)
        switch (this.state.condition) {
            case 't':
                nextPath = '/thanker'
                break
            case 'a':
                nextPath = '/activity'
                break
            default:
                nextPath = '/error'
                break
        }

        return (<Redirect
            to={{
                pathname: nextPath,
            }}
        />)
    }
}


export default URLreceiver
