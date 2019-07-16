import React, {Component} from 'react';
import {i10n} from "./i10n";
import {Cell, Grid, Row} from "@material/react-layout-grid/dist/index";
import Card, {CardActionButtons, CardActions, CardPrimaryContent} from "@material/react-card/dist/index";
import {Button} from "@material/react-button/dist/index";


class Splash extends Component{
    render (){
        const {match: {params}} = this.props;
        const lang = "lang" in params ? params.lang :'en';
        console.log('Splash is using lang: ', lang)
        return(
            <div className={"splash-container"} dir={['ar','fa'].indexOf(lang)>0? 'rtl':'ltr'}>
            <Grid>
                <Row>
                    <Cell desktopColumns={6} tabletColumns={4} phoneColumns={4}>
                        <Card>
                            <h2 className={"splash-title"}>{i10n("activity.landing.title", lang)}</h2>
                            <CardPrimaryContent>
                            </CardPrimaryContent>
                                <CardActions>
                                <CardActionButtons>
                                    <Button href={"https://studies.civilservant.io/5qop/api/login"} raised
                                            className='login-with-mediawiki'>
                                         {i10n("oauth.login.with", lang)}
                                    </Button>
                                </CardActionButtons>
                            </CardActions>

                        </Card>
                    </Cell>
                </Row>
            </Grid>
                </div>
        )
    }
}


export default Splash

