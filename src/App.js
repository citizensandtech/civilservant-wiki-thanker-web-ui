import React, {Component} from 'react';
import ThankerTask from './wiki-diff';
import {loadDataFromFile, sendThanks} from './api';
import {Cell, Grid, Row} from '@material/react-layout-grid';
import aDiffObjs from './assets/test_data/pl_439314'

import './App.scss';
import './WikipediaDiff.css';

import '@material/react-layout-grid/index.scss';
import '@material/react-card/index.scss';
import '@material/react-button/index.scss';
import '@material/react-material-icon/index.scss';

import './react-button-overrides.scss'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: null,
            diffObjs: aDiffObjs,
            isSuperThankerApp: false,
        };
    }

    updateDiffData(data) {
        this.setState({diffObjs: data})
    }

    // componentWillMount(){
    //     loadDataFromFile("aDiff.json", this.updateDiffData)
    // }

    render() {
        return (
            <Grid>
                <Row>
                    <Cell columns={12}>
                        <ThankerTask diffObjs={this.state.diffObjs}
                                     sendThanks={sendThanks}>
                        </ThankerTask>
                    </Cell>
                </Row>
            </Grid>
        );
    }
}


export default App;
