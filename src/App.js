import React, {Component} from 'react';
import ThankerTask from './wiki-diff';
import Tro from './intro';
import Progbar from './progbar'
import {sendThanks, skipThanks, getSingleTaskDatum, getInitialData, sendActivityComplete} from './api';
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

import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import ErrorBoundary from './error';
import Activity from "./activity";

fetchMock.get("https://wikithankerapi.civilservant.io/api/userData", exampleNextTask);
fetchMock.get("https://wikithankerapi.civilservant.io/api/getInitialData", exampleInitialData);
fetchMock.get("https://wikithankerapi.civilservant.io/api/activityComplete/pl/null", {'success':true});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: config,
            lang: 'en',
            userId: null,
            isSuperThanker: false,
            worksetData: [],
            worksetResults: [],
            appPhase: "intro",
            condition: null,
            currProgress: 0
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

    sendActivityDone() {
        console.log("activity done being triggered")
        sendActivityComplete(this.state.lang, this.state.userId);
        this.notifyActivityDone();
        this.nextPhase()
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

    updateActivityProgress(timerPercent){
        const currProgress = (1 - config.startProgAmount - config.endProgAmount) * (timerPercent) + config.startProgAmount
        this.setState({currProgress:currProgress})
    }

    notifyManySkips() {
        toast(i10n("thanker.tool.skip.manyskips"));
    }

    notifyThankSent() {
        toast(i10n("thanker.tool.confirmation"));
    }

    notifyActivityDone() {
        toast(i10n("activity.confirm.sent"));
    }


    render_task() {
        const currTaskPos = this.getCurrTaskPos()

        const currDiffObjs = this.state.worksetData[currTaskPos];

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
                <Tro tro={"intro"} nextPhase={this.nextPhase.bind(this)}
                next={i10n("thanker.landing.next.button", this.state.lang)}
                title={i10n("thanker.landing.title", this.state.lang)}
                body={i10n("thanker.landing.body", this.state.lang)}>
                </Tro>
        )
    }

    render_outro() {
        return (
                <Tro tro={"outro"}
                title={i10n("thanker.end.title", this.state.lang)}
                body={i10n("thanker.end.body", this.state.lang)}>
                </Tro>
        )
    }

    render() {
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
            case "activity":
                console.log("rendering ", this.state.appPhase);
                middlePart = this.render_activity();
                thankProgress = 0.5 + config.startProgAmount
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
                <Progbar progress={this.state.currProgress}
                         numThanksSent={this.getNumThanksSent()}
                         numSkipped={this.getNumSkipped()}
                />
                    <Router>
                        <Route exact path="/activity" render={()=>
                            <Activity lang={this.state.lang}
                                      appPhase={this.state.appPhase}
                                      nextPhase={this.nextPhase.bind(this)}
                                      sendActivityDone={this.sendActivityDone.bind(this)}
                                      updateActivityProgress={this.updateActivityProgress.bind(this)}
                            />}
                        />
                        <Route exact path="/thanker" render={()=>(middlePart)}/>
                    </Router>
                </ErrorBoundary>
            </div>
            )
    }
}


export default App;
