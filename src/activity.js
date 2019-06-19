import React, {Component} from 'react';
import Button from '@material/react-button';
import Card, {
    CardPrimaryContent,
    CardActions,
    CardActionButtons,
} from "@material/react-card";
import MaterialIcon from '@material/react-material-icon'

import {i10n} from './i10n';
import Countdown from "./countdown";
import Tro from "./intro";
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import {getInitialData} from "./api";

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timerStarted: false,
            timerComplete: false,
            randomActivities: this.random_activies(3)
        };
    }

    completeTimer() {
        this.setState({timerComplete: true})
    }

    startTimer() {
        this.setState({timerStarted: true})
    }

    random_activies(nmany) {
        const activites = [
            "activity.tool.activity.1",
            "activity.tool.activity.2",
            "activity.tool.activity.3",
            "activity.tool.activity.4",
            "activity.tool.activity.5",
            "activity.tool.activity.6",
            "activity.tool.activity.7",
            "activity.tool.activity.8"]
        const random_activities = getRandomSubarray(activites, nmany)
        const random_activities_li = random_activities.map((act, ind) => (
            <li key={ind}>{i10n(act, this.props.lang)}</li>))
        return <ul>{random_activities_li}</ul>
    }


    render_activity() {
        const completerButton = <Button raised className='activity-complete-button' disabled={!this.state.timerComplete}
                                     onClick={() => this.props.sendActivityDone()}>
                                  "activity.complete.button"
                                </Button>
        const starterButton = <Button raised className='activity-start-button'
                                        onClick={() => this.startTimer() }>
                                    {i10n("activity.tool.timer.start", this.props.lang )}
                                <MaterialIcon icon={'start'}/>
                                    </Button>
        const countdownTimer =    <Countdown timerStarted={this.state.timerStarted}
                                       timerCompleteCB={this.completeTimer.bind(this)}/>
        const countdownHeaderUncomplete = <h2 className={"activity-complete-header"}>
                                    {i10n("activity.tool.timer.end", this.props.lang)}</h2>
        const countdownHeaderComplete = <h2 className={"activity-complete-completed-text"}>
                                    {i10n("activity.tool.timer.end", this.props.lang)}</h2>

        const countdownHeader = this.state.timerComplete? countdownHeaderComplete: countdownHeaderUncomplete
        const actionButton = this.state.timerStarted? completerButton: starterButton
        return (
            <Grid>
                <Row>
                    <Cell desktopColumns={6} tabletColumns={10} phoneColumns={8}>
                        <Card>
                            <h2>{"Instructions"}</h2>
                            <CardPrimaryContent>
                                {i10n("activity.tool.instructions", this.props.lang)}
                                {i10n("activity.tool.three.random", this.props.lang)}
                                {this.state.randomActivities}
                            </CardPrimaryContent>
                        </Card>
                    </Cell>
                    <Cell desktopColumns={6} tabletColumns={10} phoneColumns={8}>
                        <Card>
                            {countdownHeader}
                            <CardPrimaryContent/>
                            {countdownTimer}
                            <CardActions>
                                <CardActionButtons>
                                    {actionButton}
                                </CardActionButtons>
                            </CardActions>
                        </Card>
                    </Cell>
                </Row>
            </Grid>
        )
    }

    render() {
        switch (this.props.appPhase) {
            case "intro":
                return (<Tro tro={"intro"} nextPhase={this.props.nextPhase}
                             next={i10n("activity.landing.next.button", this.props.lang)}
                             title={i10n("activity.landing.title", this.props.lang)}
                             body={i10n("activity.landing.body", this.props.lang)}>
                </Tro>)
                break
            case "tasks":
                return this.render_activity()
                break
            case "outro":
                return (<Tro tro={"outro"}
                             title={i10n("thanker.end.title", this.props.lang)}
                             body={i10n("thanker.end.body", this.props.lang)}>
                </Tro>)
                break

        }
    }
}


export default Activity