import React, {Component} from 'react';

class WikiDiff extends Component {
    render() {
        const innerHTMLObj = {__html: this.props.diffObj.diffHTML};
        return <div className="cs-wiki-diffmediawiki ltr sitedir-ltr mw-hide-empty-elt ns-0 ns-subject mw-editable skin-vector action-view">
                                                <DiffTitle newold="new" diffObj={this.props.diffObj}>
                </DiffTitle>
                <DiffTitle newold="old" diffObj={this.props.diffObj}>
                </DiffTitle>
            <table className="mw-body-content diff diff-contentalign-left">
                <colgroup>
                    <col className="diff-marker"></col>
                        <col className="diff-content"></col>
                            <col className="diff-marker"></col>
                                <col className="diff-content"></col>
                </colgroup>
                <tbody
                    data-mw="interface"
                    dangerouslySetInnerHTML={innerHTMLObj} />

            </table>
        </div>
    }
}

class DiffTitle extends Component {

    render(){
        const oOrn = this.props.newold === 'new' ? "n" : "o"
        const revIdKey = this.props.newold + "RevId"
        const revDateKey = this.props.newold + "RevDate"
        const revUserKey = this.props.newold + "RevUser"
        const revCommentKey = this.props.newold + "RevComment"
        const revId = this.props.diffObj[revIdKey]
        const revDate = this.props.diffObj[revDateKey]
        const revUser = this.props.diffObj[revUserKey]
        const revComment = this.props.diffObj[revCommentKey]

        return <tr className="diff-title">
            <td className={"diff-"+oOrn+"title"} colSpan={2}>
            <div id={"mw-diff-"+oOrn+"title1"}>
                <strong>{revUser}</strong>
            </div>
            </td>
        </tr>
    }
}


export default WikiDiff
