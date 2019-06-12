import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import Button from '@material/react-button';
import Card, {
    CardPrimaryContent,
    CardActions,
    CardActionButtons,
} from "@material/react-card";
import MaterialIcon from '@material/react-material-icon'
import talkSmileyLtr from './assets/img/talksmileyltr.svg';
// import talkSmileyRtl from './assets/img/talksmileyrtl.svg';

import {Cell, Grid, Row} from '@material/react-layout-grid';
import {i10n} from "./i10n";


class WikiDiff extends Component {
    render() {
        const rawDiffHTML = this.props.diffObj.diffHTML;
        const topRows = MakeTitleRow(this.props.diffObj);
        const diffHTML = topRows + rawDiffHTML;
        const innerHTMLObj = {__html: diffHTML};
        const textDir = this.props.diffObj.lang in ['ar', 'fa'] ? 'rtl' : 'ltr';
        return <div className={"cs-wiki-diff " + textDir + " sitedir-" + textDir +
        " mw-hide-empty-elt ns-0 ns-subject mw-editable skin-vector action-view"}>

            <table className="mw-body-content diff diff-contentalign-left">
                <colgroup>
                    <col className="diff-marker"/>
                    <col className="diff-content"/>
                    <col className="diff-marker"/>
                    <col className="diff-content"/>
                </colgroup>
                <tbody
                    data-mw="interface"
                    dangerouslySetInnerHTML={innerHTMLObj}/>
            </table>
        </div>
    }
}

class DiffTitle extends Component {

    render() {
        const oOrn = this.props.newold === 'new' ? "n" : "o";
        const revIdKey = this.props.newold + "RevId";
        const revDateKey = this.props.newold + "RevDate";
        const revUserKey = this.props.newold + "RevUser";
        const revCommentKey = this.props.newold + "RevComment";
        const revId = this.props.diffObj[revIdKey];
        const revDate = this.props.diffObj[revDateKey];
        const revUser = this.props.diffObj[revUserKey];
        const revComment = this.props.diffObj[revCommentKey];
        const revLink = "https://" + this.props.diffObj['lang'] + ".wikipedia.org/wiki/?oldid=" + revId;
        return (
            <td className={"diff-" + oOrn + "title"} colSpan={2}>
                <div id={"mw-diff-" + oOrn + "title1"}>
                    <strong>{revDate} <a href={revLink}>{revId}</a></strong>
                </div>
                <div id={"mw-diff-" + oOrn + "title2"}>
                    {revUser}
                </div>
                <div id={"mw-diff-" + oOrn + "title3"}
                     dangerouslySetInnerHTML={{__html: revComment}}>
                </div>
            </td>)
    }
}


function MakeTitleRow(diffObj) {
    const titleRow = <tr className="diff-title">
        <DiffTitle newold="new" diffObj={diffObj}>
        </DiffTitle>
        <DiffTitle newold="old" diffObj={diffObj}>
        </DiffTitle>
    </tr>;
    return ReactDOMServer.renderToStaticMarkup(titleRow)
}

class DiffConsideration extends Component {
    render() {
        return (
            <Cell desktopColumns={6} phoneColumns={12} tabletColumns={12}>
                <Card>
                    <h2 align="center">{i10n("thanker.tool.diff.title") + ' ' + this.props.cardId + 1}</h2>
                    <CardPrimaryContent>
                        <WikiDiff diffObj={this.props.diffObj}>
                        </WikiDiff>
                    </CardPrimaryContent>
                    <CardActions>
                        <CardActionButtons>
                            <Button
                                raised className='button-alternate' onClick={() => {
                                this.props.sendAndNext(5)
                            }}>
                                {i10n("thanker.tool.thank.button")}
                                <img src={talkSmileyLtr} alt="thank icon"/>
                            </Button>
                        </CardActionButtons>
                    </CardActions>
                </Card>
            </Cell>)

    }
}

class DiffConsiderationList extends Component {
    render() {
        // console.log(this.props.diffObjs);
        const sendAndNext = this.props.sendAndNext;
        if (this.props.diffObjs !== null || this.props.diffOjbs !== undefined) {
            const DiffConsiderations = this.props.diffObjs.map((diffObj, index) =>
                <DiffConsideration
                    diffObj={diffObj}
                    key={index}
                    cardId={index}
                    sendAndNext={sendAndNext}/>);
            return (<Grid>
                <Row>
                    {DiffConsiderations}
                </Row>
            </Grid>)
        } else {
            return <div>Loading.</div>
        }
    }
}


class ThankerTask extends Component {
    makeSkipButton(numSkipped) {
        const skipMessage = numSkipped < 3 ?
            <div className="thanker-task-skip-instructions"> {i10n("thanker.tool.skip.tooltip")} </div>:
            <div className="thanker-task-skip-instructions-extra"> {i10n("thanker.tool.skip.manyskips")} </div>
        return <div className="thanker-task-skip">
            {skipMessage}
            <Button
                raised className='button-alternate-skip' onClick={() => this.props.skipAndNext()}>
                {i10n("thanker.tool.skip.button")}
                <MaterialIcon icon='skip_next'/>
                {/*<MaterialIcon icon='arrow_right_alt'/>*/}
                {/*<MaterialIcon icon='arrow_forward'/>*/}
                {/*<MaterialIcon icon='arrow_forward_ios'/>*/}
                {/*<MaterialIcon icon='arrow_right'/>*/}
                {/*<MaterialIcon icon='chevron_right'/>*/}
            </Button>
        </div>
    }

    render() {
        return (<div className="thanker-task">
            <div className="thanker-task-instructions">{i10n("thanker.tool.instructions")}</div>
            <DiffConsiderationList sendAndNext={this.props.sendAndNext}
                                   diffObjs={this.props.diffObjs}/>
            {this.makeSkipButton(this.props.numSkipped)}
        </div>)
    }
}

export default ThankerTask
