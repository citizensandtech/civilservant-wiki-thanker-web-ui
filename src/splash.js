import React, {Component} from 'react';
import {i10n} from "./i10n";
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import Card, {CardActionButtons, CardActions, CardPrimaryContent} from "@material/react-card/dist/index";
import {Button} from "@material/react-button/dist/index";


class Splash extends Component {


    render() {
        const {match: {params}} = this.props;
        const langs = "lang" in params ? [params.lang] : ["en", "ar", "fa", 'de', "pl"];
        // console.log("rendering splash with langs: ", langs);
        const loginCards = langs.map((lang, index) =>
            <Cell desktopColumns={4} phoneColumns={12} tabletColumns={12} key={index}>
            <Card align={"center"} >
                <h2 className={"splash-title"}>{i10n("misc.langname", lang)}</h2>
                <CardPrimaryContent>
                    <div className={"splash-title"}>{"CivilServant Wikipedia Study"}</div>
                </CardPrimaryContent>
                <CardActions>
                    <CardActionButtons>
                        <Button href={`https://studies.civilservant.io/5qop/api/login/${lang}`} raised
                                className='login-with-mediawiki'>
                            {i10n("oauth.login.with", lang)}
                        </Button>
                    </CardActionButtons>
                </CardActions>
            </Card>
            </Cell>)
        return (
            <div className={"splash-container"} dir={['ar', 'fa'].indexOf(langs[0]) > 0 ? 'rtl' : 'ltr'}>
                <Grid>
                    <Row>
                        {loginCards}
                    </Row>
                </Grid>
            </div>
        )
    }
}


export default Splash

