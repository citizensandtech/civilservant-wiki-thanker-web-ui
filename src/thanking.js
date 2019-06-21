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
        };
    }


    getCurrTaskPos() {
        //returns negative 1 if completed
        return this.props.worksetResults.indexOf(null)
    }

    getNumThanksSent() {
        const thanks = this.props.worksetResults.filter(res => typeof(res) === "number")
        return thanks.length
    }

    getNumSkipped() {
        const skips = this.props.worksetResults.filter(res => res === "skip")
        return skips.length
    }



    skipAndNext(thankeeId) {
        console.log("skipping taskId, ", thankeeId);
        skipThanks(thankeeId, this.props.lang, this.props.userId);
        let nextWorksetResults = this.props.worksetResults
        nextWorksetResults[this.getCurrTaskPos()] = 'skip';
        this.props.updateWorksetResults(nextWorksetResults)
        const numSkipped = this.getNumSkipped()
        if (numSkipped % 3 === 0) {
            this.props.notifyManySkips()
        }
        this.nextTask();
    }

    sendAndNext(revId) {
        sendThanks(revId, this.props.lang, this.props.userId);
        let nextWorksetResults = this.props.worksetResults
        nextWorksetResults[this.getCurrTaskPos()] = revId;
        this.props.updateWorksetResults(nextWorksetResults)
        console.log("workResults are after updating: ", this.props.worksetResults);
        this.props.notifyThankSent();
        this.nextTask()
    }


    nextTask() {
        this.props.updateThankerProgress(this.getNumThanksSent(), this.getNumSkipped())
        // check if we are at the end
        if (this.getNumThanksSent() === 4 && !this.props.isSuperThanker ) { //-1 to account for 0 indexing
            this.props.nextPhase()
        } else {
            getSingleTaskDatum(this.props.appendTask)
            window.scrollTo(0,0)
        }
    }



    render_task() {
        const currTaskPos = this.getCurrTaskPos()

        const currDiffObjs = this.props.worksetData[currTaskPos];

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
                 next={i10n("thanker.landing.next.button", this.props.lang)}
                 title={i10n("thanker.landing.title", this.props.lang)}
                 body={i10n("thanker.landing.body", this.props.lang)}
            >
            </Tro>
        )
    }

    render_outro() {
        return (
            <Tro tro={"outro"}
                 title={i10n("thanker.end.title", this.props.lang)}
                 body={i10n("thanker.end.body", this.props.lang)}>
            </Tro>
        )
    }

    render() {
        console.log('in thanking render and wsd ', this.props.worksetData)
        console.log('in thanking render and wsr', this.props.worksetResults)
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
                break
            default:
                return this.render_intro();
                break;

        }
    }
}

export default Thanking
