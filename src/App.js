import React, {Component} from 'react';
import ThankerTask from './wiki-diff';
import Tro from './intro';
import Progbar from './progbar'
import {sendThanks, skipThanks, getNewTask, getUserData} from './api';
import fetchMock from 'fetch-mock';

import config from './config'

import exampleTasks from './assets/test_data/pl_4_example_tasks'
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

fetchMock.get("*", exampleNextTask);
console.log("exampleNextTask is: ", exampleNextTask)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: config,
            lang: 'pl',
            worksetData: exampleTasks,
            worksetResults: new Array(exampleTasks.length).fill(null),
            currTaskPos: 0,
            isSuperThankerApp: false,
            appPhase: "intro",
        };
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

    appendTask(taskDatum) {
        console.log("appender called with taskDatum: ", taskDatum)
        console.log("appender called and stateTask : ", this.state.worksetData)
        this.state.worksetData.push(taskDatum);
        this.state.worksetResults.push(null);
        this.setState({worksetData: this.state.worksetData})
        this.setState({worksetResults: this.state.worksetResults})
    }

    skipAndNext(taskId) {
        console.log("record next state");
        skipThanks(taskId, this.state.lang, this.state.userId);
        getUserData(this.appendTask.bind(this))
        let nextWorkResults = this.state.worksetResults
        nextWorkResults[this.state.currTaskPos] = 'skip';
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
        nextWorkResults[this.state.currTaskPos] = revId;
        console.log("workResults are after updating: ", this.state.worksetResults);
        this.setState({worksetResults: nextWorkResults});
        this.notifyThankSent();
        this.nextTask()
    }


    nextTask() {
        const currTaskPos = this.getCurrTaskPos();
        // check if we are at the end
        if (currTaskPos === -1) { //-1 to account for 0 indexing
            this.nextPhase()
        }
        this.setState({currTaskPos: currTaskPos})
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
        const currDiffObjs = this.state.worksetData[this.state.currTaskPos];
        console.log("currTask position:", this.state.currTaskPos);
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
        const currTaskPos = this.getCurrTaskPos()

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
