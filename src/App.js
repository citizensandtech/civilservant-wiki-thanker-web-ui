import React, {Component} from 'react';
import Thanking from './thanking'
import Progbar from './progbar'
import {sendThanks, skipThanks, getSingleTaskDatum, getInitialData, sendActivityComplete} from './api';
import fetchMock from 'fetch-mock';

import config from './config'

import './App.scss';

import './WikipediaDiff.css';

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
import URLreceiver from "./initiate";

fetchMock.get("https://wikithankerapi.civilservant.io/api/activityComplete/pl/null", {'success':true});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: config,
            lang: 'en',
            userId: null,
            condition: null,
            isSuperThanker: null,
            appPhase: "intro",
            currProgress: config.startProgAmount,
            worksetData: [],
            worksetResults: [],
            numThanksSent: null,
            numSkipped: null
        };
    }

    appendTask(taskDatum) {
        console.log("appender called with taskDatum: ", taskDatum)
        console.log("appender called and stateTask : ", this.state.worksetData)
        this.state.worksetData.push(taskDatum);
        this.state.worksetResults.push(null);
        this.setState({worksetData: this.state.worksetData,
                       worksetResults: this.state.worksetResults})
    }


    sendActivityDone() {
        console.log("activity done being triggered")
        sendActivityComplete(this.state.lang, this.state.userId);
        this.notifyActivityDone();
        this.nextPhase()
    }

    nextPhase() {
        console.log("next phase called curr", this.state.appPhase)
        switch (this.state.appPhase) {
            case "intro":
                this.setState({appPhase: "tasks"});
                break;
            case "tasks":
                this.setState({appPhase: "outro",
                                currProgress:1});
                break;
            default:
                this.setState({appPhase: "outro"});
        }
    }

    updateWorksetResults(nextWorksetResults){
                this.setState({worksetResults: nextWorksetResults});
    }

    updateActivityProgress(timerPercent){
        const currProgress = (1 - config.startProgAmount - config.endProgAmount) * (timerPercent) + config.startProgAmount
        this.setState({currProgress:currProgress})
    }

    updateThankerProgress(numThanksSent, numSkipped){
        console.log('update thanker progress set with', numThanksSent, numSkipped)
        const thankerPercent = numThanksSent / config.tasksPerUser
        const currProgress = (1 - config.startProgAmount - config.endProgAmount) * (thankerPercent) + config.startProgAmount
        this.setState({currProgress:currProgress,
                       numThanksSent:numThanksSent,
                        numSkipped:numSkipped})
    }

    setInitialData(initialAPIData) {
        const initialMetadata = initialAPIData.metadata
        const initialTaskData = initialAPIData.taskData
        this.setState({
            lang: initialMetadata.lang,
            condition: initialMetadata.condition,
            isSuperThanker: initialMetadata.isSuperThanker
        })


        this.setState({
            worksetData: initialTaskData,
            worksetResults: Array(initialTaskData.length).fill(null)
        })
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



    render() {
        return (
            <div className="thank-container">
                <ErrorBoundary>
                <ToastContainer/>
                <Progbar progress={this.state.currProgress}
                         numThanksSent={this.state.numThanksSent}
                         numSkipped={this.state.numSkipped}
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
                        <Route exact path="/thanker" render={()=>
                            <Thanking appPhase={this.state.appPhase}
                                      nextPhase={this.nextPhase.bind(this)}
                                      updateThankerProgress={this.updateThankerProgress.bind(this)}
                                      notifyThankSent={this.notifyThankSent}
                                      notifyManySkips={this.notifyManySkips}
                                      worksetData={this.state.worksetData}
                                      worksetResults={this.state.worksetResults}
                                      isSuperThanker={this.state.isSuperThanker}
                                      lang={this.state.lang}
                                      userId={this.state.userId}
                                      appendTask={this.appendTask.bind(this)}
                                      updateWorksetResults={this.updateWorksetResults.bind(this)}
                            />}
                        />

                        <Route path="/initiate/:lang/:userId/" render={(props) =>
                            <URLreceiver setInitialData={this.setInitialData.bind(this)}
                                         condition={this.state.condition}
                                         {...props} />}
                        />
                        <Route exact path={'/error'} render={()=><Error lang={this.state.lang}/>}/>
                    </Router>
                </ErrorBoundary>
            </div>
            )
    }
}

export default App;


const Error = ({lang}) => {
    return(<div className={"error"}>{i10n("misc.landing.error.title", lang)}</div>)
}
