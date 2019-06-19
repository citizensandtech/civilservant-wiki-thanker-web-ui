import React, {Component} from 'react';
import Button from '@material/react-button';
import Card, {
    CardPrimaryContent,
    CardActions,
    CardActionButtons,
} from "@material/react-card";
import MaterialIcon from '@material/react-material-icon'



class Tro extends Component {
    render() {
        const action =  this.props.next? <Button raised className='button-alternate-skip' onClick={() => this.props.nextPhase()}>
                                                        {this.props.next}
                                                        <MaterialIcon icon='skip_next'/> </Button>:
                                                    <MaterialIcon icon='stop'/>;
        return (
            <div className="cs-thanker-intro">
                <Card>
                    <h2 align="center">{this.props.title}</h2>
                    <CardPrimaryContent>
                        <div className="cs-thanker-intro-para">
                            <p>{this.props.body}</p>
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
