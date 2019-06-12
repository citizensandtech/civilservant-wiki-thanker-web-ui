import React from 'react';
import LinearProgress from '@material/react-linear-progress';
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import {i10n} from "./i10n";

class Progbar extends React.Component {
    render() {
        return (
            <div className={"thanker-progress"}>
                <LinearProgress
                    buffer={1.0}
                    progress={this.props.progress}
                />
            <Grid>
                    <div className={"thanker-progress-progress"}>
                        {i10n("thanker.tool.progress")}
                    </div>
                <Row>
                    <Cell desktopColumns={6} phoneColumns={12} tabletColumns={12}>
                        <div className={"thanker-progress-numthanked"}>
                            {i10n("thanker.tool.progress.1")}
                            {this.props.numThanksSent}
                        </div>
                    </Cell>
                    <Cell desktopColumns={6} phoneColumns={12} tabletColumns={12}>
                        <div className={"thanker-progress-numskipped"}>
                            {i10n("thanker.tool.progress.2")}
                            {this.props.numSkipped}
                        </div>
                    </Cell>
                </Row>
            </Grid>
            </div>
        );
    }
}

export default Progbar
