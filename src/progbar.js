import React from 'react';
import LinearProgress from '@material/react-linear-progress';
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import {i10n} from "./i10n";
import {Button} from "@material/react-button/dist/index";
import wpLogo from './assets/img/wplogo.png';


class Progbar extends React.Component {
    render() {
        // TODO refactor all these checks to just one loggedIn or Out Check

        const numSkippedCell = (this.props.numSkipped !== null && this.props.loggedOut === false && this.props.condition === 'thank') ?
            <Cell desktopColumns={4} phoneColumns={2} tabletColumns={2}>
                <div className={"thanker-progress-numthanked"}>
                    {i10n("thanker.tool.progress.1", this.props.lang, this.props.numThanksSent)}
                </div>
            </Cell> : <div></div>;
        const numThanksCell = (this.props.numThanksSent !== null && this.props.loggedOut === false && this.props.condition === 'thank')  ?
            <Cell desktopColumns={4} phoneColumns={2} tabletColumns={2}>
                <div className={"thanker-progress-numskipped"}>
                    {i10n("thanker.tool.progress.2", this.props.lang, this.props.numSkipped)}
                </div>
            </Cell> : <div></div>;


        const logoutButton = (this.props.loggedOut || this.props.loggedOut==null)? <div></div>: <Button onClick={()=>this.props.logOutUser()}>
            {i10n("oauth.logout.button", this.props.lang)}
        </Button>;
        const progLabel = this.props.progress <= 0.2 ? "" : i10n("thanker.tool.progress", this.props.lang);
        const miniLogo = this.props.userName? <img className={"thanker-progress-progress-wplogo"} src={wpLogo} alt="Wikipedia logo."/>: <div></div>;
        const displayName = this.props.userName ? `:\t ${this.props.userName}.`: "";
        return (
            <div className={"thanker-progress"}>
                <LinearProgress
                    buffer={1.0}
                    progress={this.props.progress}
                    reversed={this.props.rtl}
                />
                <Grid>
                    <Row>
                        <Cell desktopColumns={4} phoneColumns={4} tabletColumns={3}>
                            <div className={"thanker-progress-progress"}>
                                {miniLogo}
                                {progLabel}
                                {displayName}
                                {logoutButton}
                            </div>
                        </Cell>
                        {numSkippedCell}
                        {numThanksCell}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Progbar
