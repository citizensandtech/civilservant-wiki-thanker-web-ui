import React, {Component} from 'react';
import ThankerTask from './wiki-diff';
import Tro from './intro';
import Progbar from './progbar'
import {sendThanks, skipThanks, getSingleTaskDatum, getInitialData} from './api';
import fetchMock from 'fetch-mock';

import config from './config'

import exampleInitialData from './assets/test_data/pl_intialdata_plus_2_example_tasks'
import exampleNextTask from './assets/test_data/pl_1_example_next_task'
import './App.scss';

import './WikipediaDiff.css';
import {Cell, Grid, Row} from '@material/react-layout-grid';

import '@material/react-layout-grid/index.scss';
import '@material/react-card/index.scss';
import '@material/react-button/index.scss';
import '@material/react-material-icon/index.scss';
import '@material/react-linear-progress/index.scss';
import './react-button-overrides.scss'

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {i10n} from "./i10n";

import ErrorBoundary from './error';

fetchMock.get("https://wikithankerapi.civilservant.io/api/userData", exampleNextTask);
fetchMock.get("https://wikithankerapi.civilservant.io/api/getInitialData", exampleInitialData);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: config,
            lang: null,
            userId: null,
            isSuperThanker: false,
            worksetData: Array(),
            worksetResults: Array(),
            appPhase: "intro",
        };
        // get live data
        getInitialData(this.setIntialData.bind(this))
    }

    getCurrTaskPos() {
        //returns negative 1 if completed
        return this.state.worksetResults.indexOf(null)
    }

    getNumThanksSent() {
        const thanks = this.state.worksetResults.filter(res => typeof(res) === "number")
        return thanks.length
    }

    getNumSkipped() {
        const skips = this.state.worksetResults.filter(res => res === "skip")
        return skips.length
    }

    setIntialData(initialAPIData){
        const initialMetadata = initialAPIData.metadata
        this.setState({lang:initialMetadata.lang,
                       isSuperThanker:initialMetadata.isSuperThanker})
        const initialTaskData = initialAPIData.taskData
        this.setState({worksetData:initialTaskData,
                       worksetResults:Array(initialTaskData.length).fill(null)})
    }

    appendTask(taskDatum) {
        console.log("appender called with taskDatum: ", taskDatum)
        console.log("appender called and stateTask : ", this.state.worksetData)
        this.state.worksetData.push(taskDatum);
        this.state.worksetResults.push(null);
        this.setState({worksetData: this.state.worksetData,
                       worksetResults: this.state.worksetResults})
    }

    skipAndNext(thankeeId) {
        console.log("skipping taskId, ", thankeeId);
        skipThanks(thankeeId, this.state.lang, this.state.userId);
        let nextWorkResults = this.state.worksetResults
        nextWorkResults[this.getCurrTaskPos()] = 'skip';
        this.setState({worksetResults: nextWorkResults});
        const numSkipped = this.getNumSkipped()
        if (numSkipped % 3 === 0) {
            this.notifyManySkips()
        }
        this.nextTask();
    }

    sendAndNext(revId) {
        sendThanks(revId, this.state.lang, this.state.userId);
        let nextWorkResults = this.state.worksetResults
        nextWorkResults[this.getCurrTaskPos()] = revId;
        console.log("workResults are after updating: ", this.state.worksetResults);
        this.setState({worksetResults: nextWorkResults});
        this.notifyThankSent();
        this.nextTask()
    }


    nextTask() {
        // check if we are at the end
        if (this.getNumThanksSent() === 4 && !this.state.isSuperThanker ) { //-1 to account for 0 indexing
            this.nextPhase()
        } else {
        getSingleTaskDatum(this.appendTask.bind(this))
        }
    }

    nextPhase() {
        console.log("next phase called curr", this.state.appPhase)
        switch (this.state.appPhase) {
            case "intro":
                this.setState({appPhase: "tasks"});
                break;
            case "tasks":
                this.setState({appPhase: "outro"});
                break;
            default:
                this.setState({appPhase: "outro"});
        }
    }

    notifyManySkips() {
        toast(i10n("thanker.tool.skip.manyskips"));
    }

    notifyThankSent() {
        toast(i10n("thanker.tool.confirmation"));
    }


    render_task() {
        const currTaskPos = this.getCurrTaskPos()

        const currDiffObjs = this.state.worksetData[currTaskPos];
        console.log("currTask position:", currTaskPos);
        console.log("worksetData is: ", this.state.worksetData);
        console.log("worksetResults is: ", this.state.worksetResults);
        console.log("currDiffObjs :", currDiffObjs);

        return (
            <Grid>
                <Row>
                    <Cell columns={12}>
                        <ThankerTask diffObjs={currDiffObjs}
                                     sendAndNext={this.sendAndNext.bind(this)}
                                     skipAndNext={this.skipAndNext.bind(this)}
                                     numThanksSent={this.getNumThanksSent()}
                                     numSkipped={this.getNumSkipped()}
                        >
                        </ThankerTask>
                    </Cell>
                </Row>
            </Grid>
        );
    }

    render_intro() {
        return (
                <Tro tro={"intro"} nextPhase={this.nextPhase.bind(this)}>
                </Tro>
        )
    }

    render_outro() {
        return (
                <Tro tro={"outro"}>
                </Tro>
        )
    }

    render() {
        console.log('in render initial: superthanker', this.state.isSuperThanker)

        let middlePart = this.render_intro()
        let thankProgress = 0

        switch (this.state.appPhase) {
            case "intro":
                console.log("rendering ", this.state.appPhase);
                middlePart = this.render_intro();
                thankProgress = config.startProgAmount;
                break;
            case "tasks":
                console.log("rendering ", this.state.appPhase);
                middlePart = this.render_task();
                thankProgress = (1 - config.startProgAmount - config.endProgAmount) * (this.getNumThanksSent() / config.tasksPerUser) + config.startProgAmount

                break;
            case "outro":
                console.log("rendering ", this.state.appPhase);
                middlePart = this.render_outro();
                thankProgress = 1
                break
            default:
                console.log("default case triggered")
                middlePart = this.render_intro();
                thankProgress = config.startProgAmount;
                break;
        }
        return (
            <div className="thank-container">
                <ErrorBoundary>
                <ToastContainer/>
                <Progbar progress={thankProgress}
                         numThanksSent={this.getNumThanksSent()}
                         numSkipped={this.getNumSkipped()}
                />
                {middlePart}
                </ErrorBoundary>
            </div>
            )
    }
}


export default App;
