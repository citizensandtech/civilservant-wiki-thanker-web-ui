import React, {Component} from 'react';
import Button from '@material/react-button';
import Card, {
    CardPrimaryContent,
    CardActions,
    CardActionButtons,
} from "@material/react-card";
import MaterialIcon from '@material/react-material-icon'

import {i10n} from './i10n';



class Tro extends Component {
    render() {
        const isIntro = this.props.tro === "intro"
        const troTitle = isIntro ? i10n("thanker.landing.title"): i10n("thanker.end.title");
        const explainerText = isIntro? i10n("thanker.landing.body"): i10n("thanker.end.body");
        const nextText = i10n("thanker.landing.next.button")
        const action =  isIntro? <Button raised className='button-alternate-skip' onClick={() => this.props.nextPhase()}>
                                                        {nextText}
                                                        <MaterialIcon icon='skip_next'/> </Button>:
                                                        <p>Done</p>;

        return (
            <div className="cs-thanker-intro">
                <Card>
                    <h2 align="center">{troTitle}</h2>
                    <CardPrimaryContent>
                        <div className="cs-thanker-intro-para">
                            <p>{explainerText}</p>
                        </div>
                    </CardPrimaryContent>
                    <CardActions>
                        <CardActionButtons>
                            {action}
                        </CardActionButtons>
                    </CardActions>
                </Card>
            </div>
            )
    }
}



export default Tro
