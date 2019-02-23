import React, {Component} from 'react';

class WikiDiff extends Component {
    render() {
        const innerHTMLObj = {__html: this.props.diffObj.diffHTML};
        return (<div className="cs-wiki-diff">
                <div className="mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-0 ns-subject mw-editable skin-vector action-view">
                <div className="body" id="content" role="main">
                <div id="bodyContent" className="mw-body-content diff diff-contentalign-left">
                <DiffTitle newold="new" diffObj={this.props.diffObj}>
                </DiffTitle>
                 <DiffTitle newold="old" diffObj={this.props.diffObj}>
                </DiffTitle>
                <table
                           data-mw="interface"
                           dangerouslySetInnerHTML={innerHTMLObj} />
                </div>
                </div>
                </div>
                </div>)
    }
}

class DiffTitle extends Component {

    render(){
        const revIdKey = this.props.newold + "RevId"
        const revDateKey = this.props.newold + "RevDate"
        const revUserKey = this.props.newold + "RevUser"
        const revCommentKey = this.props.newold + "RevComment"
        const revId = this.props.diffObj[revIdKey]
        console.log(revIdKey)
        return <div>{revId}</div>
    }
}

export default WikiDiff
