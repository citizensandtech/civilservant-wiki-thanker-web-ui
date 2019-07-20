import React, {Component} from 'react';
import {i10n} from "./i10n";
import {getSingleTaskDatum, sendThanks, skipThanks} from "./api";
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import ThankerTask from "./wiki-diff";
import Tro from "./intro";

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
        return thanks.length + this.props.prevNumThanksSent;
    }

    getNumSkipped() {
        const skips = this.props.worksetResults.filter(res => res === "skip");
        return skips.length + this.props.prevNumSkipped;
    }


    skipCB = () => {
        console.log("SKIP CALLBACK BEING TRIGGERED")
        let nextWorksetResults = this.props.worksetResults;
        nextWorksetResults[this.getCurrTaskPos()] = 'skip';
        this.props.updateWorksetResults(nextWorksetResults);
        this.nextTask();
        const numSkipped = this.getNumSkipped();
        if (numSkipped % 3 === 0) {
            this.props.notifyManySkips(numSkipped)
        }
    };

    skipAndNext(thankeeId) {
        // console.log('in skip and next and thankee id is', thankeeId);
        // lang, thankeeUserId, thankingUserId, cb
        skipThanks(this.props.lang, thankeeId, this.props.userId, this.skipCB)


    }

    sendCB = (revId) => {
        let nextWorksetResults = this.props.worksetResults;
        nextWorksetResults[this.getCurrTaskPos()] = revId;
        this.props.updateWorksetResults(nextWorksetResults);
        this.props.notifyThankSent();
        const numThanksSent = this.getNumThanksSent();
        if ((numThanksSent % 10 === 0) & (this.props.isSuperThanker)) {
            this.props.notifySuperThankerProg(numThanksSent)
        }
        this.nextTask()
    };

    sendAndNext(revId) {
        sendThanks(this.props.lang, revId, this.props.userId, this.sendCB);
    }

    isWorksetComplete(){
        return (this.getNumThanksSent() >= 4) && (!this.props.isSuperThanker)
    }


    nextTask() {
        console.log("NEXT TASK CB TRIGGERED")
        this.props.updateThankerProgress(this.getNumThanksSent(), this.getNumSkipped());
        // check if we are at the end
        if (this.isWorksetComplete()) { //-1 to account for 0 indexing
            this.props.nextPhase()
        } else {
            getSingleTaskDatum(this.props.lang, this.props.userId, this.props.appendTask);
            window.scrollTo(0, 0)
        }
    }


    render_task() {
        const currTaskPos = this.getCurrTaskPos();
        const currDiffObjs = this.props.worksetData[currTaskPos];
        console.log("currTaskPos is, ", currTaskPos)
        console.log("currDiffObjs are:, ", currDiffObjs)
        const instructions = this.props.isSuperThanker? i10n("superthanker.landing.instructions",this.props.lang):
                                                        i10n("thanker.tool.instructions",this.props.lang);
        return (
            <Grid>
                <Row>
                    <Cell columns={12}>
                        <div className="thanker-task-instructions">
                            {instructions}
                        </div>
                        <ThankerTask diffObjs={currDiffObjs}
                                     sendAndNext={this.sendAndNext.bind(this)}
                                     skipAndNext={this.skipAndNext.bind(this)}
                                     numThanksSent={this.getNumThanksSent()}
                                     numSkipped={this.getNumSkipped()}
                                     rtl={this.props.rtl}
                                     lang={this.props.lang}
                        >
                        </ThankerTask>
                    </Cell>
                </Row>
            </Grid>
        );
    }


    render_intro() {
        const title = this.props.isSuperThanker ? i10n("superthanker.landing.title", this.props.lang):
            i10n("thanker.landing.title", this.props.lang)
        const body = this.props.isSuperThanker ? <div>{i10n("superthanker.landing.greeting", this.props.lang)} <br/> {i10n("superthanker.landing.instructions.2", this.props.lang)}</div> :
            i10n("thanker.landing.body", this.props.lang)
        return (
            <Tro tro={"intro"} nextPhase={() => {this.props.nextPhase()}}
                 next={i10n("thanker.landing.next.button", this.props.lang)}
                 title={title}
                 body={body}
                 rtl={this.props.rtl} />
        )
    }

    render_outro() {
        const nextText = this.props.loggedOut ? null : i10n("oauth.logout.button", this.props.lang);
        return (
            <Tro tro={"outro"}
                 next={nextText} nextPhase={this.props.logOutUser}
                 title={i10n("thanker.end.title", this.props.lang)}
                 body={i10n("thanker.end.body", this.props.lang)}
                 rtl={this.props.rtl}
            >
            </Tro>
        )
    }

    render() {
        console.log('in thanking render and wsd ', this.props.worksetData);
        console.log('in thanking render and wsr', this.props.worksetResults);
        // console.log('in thanking render and prns', this.props.prevNumThanksSent);
        switch (this.props.appPhase) {
            case "intro":
                // console.log("rendering ", this.props.appPhase);
                return this.render_intro();
            case "tasks":
                // console.log("rendering ", this.props.appPhase);
                if (this.isWorksetComplete()){return this.render_outro()}
                else {return this.render_task();}
            case "activity":
                // console.log("rendering ", this.props.appPhase);
                return this.render_activity();
            case "outro":
                // console.log("rendering ", this.props.appPhase);
                return this.render_outro();
            default:
                return this.render_intro();
        }
    }
}

export default Thanking
