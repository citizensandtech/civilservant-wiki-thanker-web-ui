import React, {Component} from 'react';
import Thanking from './thanking'
import Progbar from './progbar'
import {sendActivityComplete, logOut} from './api';

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

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

import ErrorBoundary from './error';
import Activity from "./activity";
import URLreceiver from "./initiate";
import Splash from "./splash"


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: config,
            lang: 'en',
            userId: null,
            userName: null,
            condition: null,
            isSuperThanker: null,
            rtl: false,
            toastPos: null,
            appPhase: "intro",
            currProgress: config.startProgAmount,
            worksetData: [],
            worksetResults: [],
            prevNumThanksSent: null,
            prevNumSkipped: null,
            numThanksSent: null,
            numSkipped: null,
            loggedOut: false,
            serverSubDir: process.env.PUBLIC_URL? "/5qop/fe": ""
        };
    }

    componentDidMount(){
    document.title = "CivilServant Wikipedia Study"
    }

    appendTask(taskDatum) {
        // console.log("appender called with taskDatum: ", taskDatum);
        // console.log("appender called and stateTask : ", this.state.worksetData);
        this.state.worksetData.push(taskDatum);
        this.state.worksetResults.push(null);
        this.setState({
            worksetData: this.state.worksetData,
            worksetResults: this.state.worksetResults
        })
    }

    activityDoneCallback = () => {
        this.notifyActivityDone();
        this.nextPhase()
    };

    sendActivityDone() {
        sendActivityComplete(this.state.lang, this.state.userId, this.activityDoneCallback);
    }

    logOutCallback = () => {
        this.setState({loggedOut: true, userName: null});
        this.notifyLogOut()
        //todo Redirect the user to the an error page where they can log in again.
    };

    logOutUser() {
        logOut(this.state.lang, this.state.userId, this.logOutCallback)

    }

    nextPhase() {
        console.log("next phase called curr", this.state.appPhase);
        switch (this.state.appPhase) {
            case "intro":
                this.setState({appPhase: "tasks"});
                break;
            case "tasks":
                this.setState({
                    appPhase: "outro",
                    currProgress: 1
                });
                break;
            default:
                this.setState({appPhase: "outro"});
        }
    }

    updateWorksetResults(nextWorksetResults) {
        this.setState({worksetResults: nextWorksetResults});
    }

    updateActivityProgress(timerPercent) {
        const currProgress = (1 - config.startProgAmount - config.endProgAmount) * (timerPercent) + config.startProgAmount;
        this.setState({currProgress: currProgress})
    }

    updateThankerProgress(numThanksSent, numSkipped) {
        console.log('update thanker progress set with', numThanksSent, numSkipped);
        const tasksPerUser = this.state.isSuperThanker? config.tasksPerUserSuper: config.tasksPerUser;
        const thankerPercent = numThanksSent / tasksPerUser;
        const currProgress = (1 - config.startProgAmount - config.endProgAmount) * (thankerPercent) + config.startProgAmount;
        this.setState({
            currProgress: currProgress,
            numThanksSent: numThanksSent,
            numSkipped: numSkipped
        })
    }

    setInitialData(initialAPIData) {
        // TODO validate the response that it has metadata. Notify user with error to contact us
        const initialMetadata = initialAPIData.metadata;
        const initialTaskData = initialAPIData.taskData;
        const rtlLang = ['ar', 'fa'].indexOf(initialMetadata.lang) >= 0;
        console.log("I saw taskData as: ", initialTaskData)
        this.setState({
            lang: initialMetadata.lang,
            userId: initialMetadata.userId,
            userName: initialMetadata.userName,
            condition: initialMetadata.condition,
            isSuperThanker: initialMetadata.isSuperThanker,
            prevNumSkipped: initialMetadata.numSkipped? initialMetadata.numSkipped: 0,
            prevNumThanksSent: initialMetadata.numThanksSent? initialMetadata.numThanksSent: 0,
            numSkipped: initialMetadata.numSkipped? initialMetadata.numSkipped: 0,
            numThanksSent: initialMetadata.numThanksSent? initialMetadata.numThanksSent: 0,
            rtl: rtlLang,
            toastPos: rtlLang? toast.POSITION.TOP_LEFT: toast.POSITION.TOP_RIGHT,

            worksetData: initialTaskData,
            worksetResults: Array(initialTaskData.length).fill(null)

        });

    }

    notifyManySkips(numSkips) {
        toast(i10n("thanker.tool.skip.manyskips", this.state.lang, numSkips), {position: this.state.toastPos});
    }

    notifyThankSent() {
        toast(i10n("thanker.tool.confirmation", this.state.lang), {position: this.state.toastPos});
    }

    notifyActivityDone() {
        toast(i10n("activity.confirm.sent", this.state.lang), {position: this.state.toastPos});
    }

    notifyLogOut() {
        toast(i10n("oauth.logout.you", this.state.lang), {position: this.state.toastPos});
    }

    notifySuperThankerProg(numThanksSent) {
        let progText = i10n("thanker.tool.progress.1", this.state.lang, numThanksSent);
        for(let i=0; i<=numThanksSent; i++){
            progText += '👏'
        }
        toast(progText, {position: this.state.toastPos});
    }

    notifyError() {
        toast(i10n("oauth.logout.you", this.state.lang), {position: this.state.toastPos});
    }


    render() {
        const loggedOutRedir = this.state.loggedOut? <Redirect to={{pathname: `${this.state.serverSubDir}/splash/`}} />: null;
        // console.log(`base url is: ${process.env.PUBLIC_URL}`)
        return (
            <div className={this.state.rtl ? "container-rtl" : "container-ltr"}>
                <ErrorBoundary>
                    <ToastContainer rtl={this.state.rtl}
                                    toastClassName="extra-toasty"
                                    progressClassName={"extra-toasty-progress"}/>
                    <Progbar progress={this.state.currProgress}
                             numThanksSent={this.state.numThanksSent}
                             numSkipped={this.state.numSkipped}
                             logOutUser={this.logOutUser.bind(this)}
                             loggedOut={this.state.loggedOut}
                             userName={this.state.userName}
                             rtl={this.state.rtl}
                             lang={this.state.lang}
                    />
                    <div className={"interactable-container"}>
                        {/*<Router basename={process.env.PUBLIC_URL}>*/}
                        <Router>
                            {loggedOutRedir}
                            <Route exact path={`${this.state.serverSubDir}/activity`} render={() =>
                                <Activity lang={this.state.lang}
                                          appPhase={this.state.appPhase}
                                          nextPhase={this.nextPhase.bind(this)}
                                          logOutUser={this.logOutUser.bind(this)}
                                          sendActivityDone={this.sendActivityDone.bind(this)}
                                          updateActivityProgress={this.updateActivityProgress.bind(this)}
                                          loggedOut={this.state.loggedOut}
                                          rtl={this.state.rtl}
                                          serverSubDir={this.state.serverSubDir}
                                />}
                            />
                            <Route exact path={`${this.state.serverSubDir}/thanker`} render={() =>
                                <Thanking appPhase={this.state.appPhase}
                                          nextPhase={this.nextPhase.bind(this)}
                                          rtl={this.state.rtl}
                                          updateThankerProgress={this.updateThankerProgress.bind(this)}
                                          notifyThankSent={this.notifyThankSent.bind(this)}
                                          notifyManySkips={this.notifyManySkips.bind(this)}
                                          notifySuperThankerProg={this.notifySuperThankerProg.bind(this)}
                                          worksetData={this.state.worksetData}
                                          worksetResults={this.state.worksetResults}
                                          isSuperThanker={this.state.isSuperThanker}
                                          lang={this.state.lang}
                                          userId={this.state.userId}
                                          appendTask={this.appendTask.bind(this)}
                                          updateWorksetResults={this.updateWorksetResults.bind(this)}
                                          logOutUser={this.logOutUser.bind(this)}
                                          loggedOut={this.state.loggedOut}
                                          prevNumThanksSent={this.state.prevNumThanksSent}
                                          prevNumSkipped={this.state.prevNumSkipped}
                                          serverSubDir={this.state.serverSubDir}
                                />}
                            />

                            <Route path={[`${this.state.serverSubDir}/initiate/:lang/:userId/`,
                                          `${this.state.serverSubDir}/initiate`]} render={(props) =>
                                <URLreceiver setInitialData={this.setInitialData.bind(this)}
                                             condition={this.state.condition}
                                             serverSubDir={this.state.serverSubDir}
                                             {...props} />}
                            />
                            <Route exact path={[`${this.state.serverSubDir}/splash/:lang/`,
                                          `${this.state.serverSubDir}/splash`,
                                          `${this.state.serverSubDir}/`]} render={(props) =>
                                <Splash serverSubDir={this.state.serverSubDir}
                                             {...props} />}
                            />
                            <Route exact path={`${this.state.serverSubDir}/error`} render={() => <Error lang={this.state.lang}/>}/>
                        </Router>
                    </div>
                </ErrorBoundary>
            </div>
        )
    }
}

export default App;

const Error = ({lang}) => {
    console.log('this is the error page');
    return (<div className={"error"}>{i10n("misc.landing.error.title", lang)}</div>)
};
