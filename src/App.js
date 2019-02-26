import React, {Component} from 'react';
import ThankerTask from './wiki-diff'

import './App.scss';
import './WikipediaDiff.css';
import aDiffJson from './assets/aDiff.json';

import {Cell, Grid, Row} from '@material/react-layout-grid';

import '@material/react-layout-grid/index.scss';
import '@material/react-card/index.scss';
import '@material/react-button/index.scss';

// add the appropriate line(s) in Step 3a if you are using compiled CSS instead.

class App extends Component {
  render() {
    return (
        <Grid>
        <Row>
            <Cell columns={12}>
                <ThankerTask diffObjs={aDiffJson}>
                </ThankerTask>
            </Cell>
        </Row>
        </Grid>
    );
  }
}




export default App;
