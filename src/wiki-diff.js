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
import talkSmileyRtl from './assets/img/talksmileyrtl.svg';

import {Cell, Grid, Row} from '@material/react-layout-grid';
import {i10n} from "./i10n";


class WikiDiff extends Component {
    render() {
        const rawDiffHTML = this.props.diffObj.diffHTML;
        const topRows = MakeTitleRow(this.props.diffObj, this.props.lang);
        const diffHTML = topRows + rawDiffHTML;
        const innerHTMLObj = {__html: diffHTML};
        const textDir = ['ar', 'fa'].indexOf(this.props.lang) >=0 ? 'rtl' : 'ltr';
        const diffAlignClassName = textDir === "ltr" ? "diff-contentalign-left" : "diff-contentalign-right";
        // console.log("textDir ", textDir)
        // console.log("lang is ", this.props.diffObj.lang, this.props.lang)
        // console.log("diff align class", diffAlignClassName)
        return <div className={"cs-wiki-diff " + textDir + " sitedir-" + textDir +
        " mw-hide-empty-elt ns-0 ns-subject mw-editable skin-vector action-view"}>

            <table className={`mw-body-content diff ${diffAlignClassName}`}>
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
        const localUrlPrefix = "https://" + this.props.lang + ".wikipedia.org/wiki";
        const revComment_raw = this.props.diffObj[revCommentKey];
        const revComment_urlfix = revComment_raw.replace('/wiki', localUrlPrefix);
        const revComment = revComment_urlfix.replace('<a href=', '<a target="_blank" rel="noopener noreferrer" href=')
        const revLink = localUrlPrefix + "/?oldid=" + revId;
        return (
            <td className={"diff-" + oOrn + "title"} colSpan={2}>
                <div id={"mw-diff-" + oOrn + "title1"}>
                    <strong>{revDate} <a target="_blank" rel="noopener noreferrer" href={revLink}>{revId}</a></strong>
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


function MakeTitleRow(diffObj, lang) {
    const titleRow = <tr className="diff-title">
        <DiffTitle newold={"old"} diffObj={diffObj} lang={lang}>
        </DiffTitle>
        <DiffTitle newold={"new"} diffObj={diffObj} lang={lang}>
        </DiffTitle>
    </tr>;
    return ReactDOMServer.renderToStaticMarkup(titleRow)
}

class DiffConsideration extends Component {
    render() {
        return (
            <Cell desktopColumns={6} phoneColumns={12} tabletColumns={12}>
                <Card>
                    <h2 align="center">{i10n("thanker.tool.diff.title", this.props.lang, `${this.props.cardId + 1}`)}</h2>
                    <CardPrimaryContent>
                        <WikiDiff diffObj={this.props.diffObj} lang={this.props.lang}>
                        </WikiDiff>
                    </CardPrimaryContent>
                    <CardActions>
                        <CardActionButtons>
                            <Button
                                raised className='button-alternate' onClick={() => {
                                this.props.sendAndNext(this.props.diffObj.newRevId)} }
                                trailingIcon={<img src={this.props.rtl ? talkSmileyRtl : talkSmileyLtr}
                                                   alt="thank icon"/>}
                            >
                                {i10n("thanker.tool.thank.button", this.props.lang)}
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
                    sendAndNext={sendAndNext}
                    lang={this.props.lang}
                    rtl={this.props.rtl}/>);
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
        let skipMessage = <div></div>
        if (!this.props.isSuperThanker){
        skipMessage = numSkipped < 3 ?
            <div className="thanker-task-skip-instructions"> {i10n("thanker.tool.skip.tooltip", this.props.lang, 4)} </div> :
            <div className="thanker-task-skip-instructions-extra"> {i10n("thanker.tool.skip.manyskips", this.props.lang, numSkipped)} </div>;
        }
        const thankeeId = this.props.diffObjs[0].newRevUser;
        return <div className="thanker-task-skip">
            {skipMessage}
            <Button raised className='button-alternate-skip' onClick={() => this.props.skipAndNext(thankeeId)}
                    trailingIcon={this.props.rtl ? <MaterialIcon icon='skip_previous'/> :
                        <MaterialIcon icon='skip_next'/>}>
                {i10n("thanker.tool.skip.button", this.props.lang)}
            </Button>
        </div>
    }

    render() {
        return (<div className="thanker-task">
            <DiffConsiderationList sendAndNext={this.props.sendAndNext}
                                   diffObjs={this.props.diffObjs}
                                   lang={this.props.lang}
                                   rtl={this.props.rtl}/>
            {this.makeSkipButton(this.props.numSkipped)}
        </div>)
    }
}

export default ThankerTask
