import React, {Component} from 'react';
import {i10n} from "./i10n";
import {getInitialData, getSingleTaskDatum, sendThanks, skipThanks} from "./api";
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import ThankerTask from "./wiki-diff";
import Tro from "./intro";

import fetchMock from "fetch-mock";

import exampleInitialData from './assets/test_data/pl_intialdata_plus_2_example_tasks'
import exampleNextTask from './assets/test_data/pl_1_example_next_task'

fetchMock.get("https://wikithankerapi.civilservant.io/api/userData", exampleNextTask);
fetchMock.get("https://wikithankerapi.civilservant.io/api/getInitialData", exampleInitialData);

class Thanking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: null,
            userId: null,
            isSuperThanker: false,
            worksetData: [],
            worksetResults: [],
        };
                // get live data
        getInitialData(this.setInititalData.bind(this))
    }

    setInititalData(initialAPIData) {
        const initialMetadata = initialAPIData.metadata
        this.setState({
            lang: initialMetadata.lang,
            isSuperThanker: initialMetadata.isSuperThanker
        })
        this.props.setLang(initialMetadata.lang)

        const initialTaskData = initialAPIData.taskData
        this.setState({
            worksetData: initialTaskData,
            worksetResults: Array(initialTaskData.length).fill(null)
        })
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
            this.props.notifyManySkips()
        }
        this.nextTask();
    }

    sendAndNext(revId) {
        sendThanks(revId, this.state.lang, this.state.userId);
        let nextWorkResults = this.state.worksetResults
        nextWorkResults[this.getCurrTaskPos()] = revId;
        console.log("workResults are after updating: ", this.state.worksetResults);
        this.setState({worksetResults: nextWorkResults});
        this.props.notifyThankSent();
        this.nextTask()
    }


    nextTask() {
        // check if we are at the end
        if (this.getNumThanksSent() === 4 && !this.state.isSuperThanker ) { //-1 to account for 0 indexing
            this.props.nextPhase()
        } else {
            getSingleTaskDatum(this.appendTask.bind(this))
            this.props.updateThankerProgress(this.getNumThanksSent(), this.getNumSkipped())
        }
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

    zeroThankerProgress(){
        this.props.updateThankerProgress(0,0)
    }

    render_intro() {
        return (
            <Tro tro={"intro"} nextPhase={() =>(this.zeroThankerProgress.bind(this)(), this.props.nextPhase())}
                 next={i10n("thanker.landing.next.button", this.state.lang)}
                 title={i10n("thanker.landing.title", this.state.lang)}
                 body={i10n("thanker.landing.body", this.state.lang)}
            >
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
        let thankProgress = 0

        switch (this.props.appPhase) {
            case "intro":
                console.log("rendering ", this.props.appPhase);
                return this.render_intro();
                break;
            case "tasks":
                console.log("rendering ", this.props.appPhase);
                return this.render_task();
                break;
            case "activity":
                console.log("rendering ", this.props.appPhase);
                return this.render_activity();
                break;
            case "outro":
                console.log("rendering ", this.props.appPhase);
                return this.render_outro();
                thankProgress = 1
                break
            default:
                console.log("default case triggered")
                return this.render_intro();
                break;

        }
    }
}

export default Thanking
