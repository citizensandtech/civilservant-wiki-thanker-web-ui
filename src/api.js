// Sending Functions
import fetch from 'fetch-retry'
import {toast} from 'react-toastify'

import fetchMock from "fetch-mock";

import exampleInitialData from './assets/test_data/pl_intialdata_plus_2_example_tasks'
import exampleInitialDataFA from './assets/test_data/fa_intialdata_plus_2_example_tasks'
import exampleInitialDataActivity from './assets/test_data/pl_intialdata_plus_activity'
import exampleInitialDataActivityFA from './assets/test_data/fa_intialdata_plus_activity'
import exampleNextTask from './assets/test_data/pl_1_example_next_task'



console.log(`Process.env.PUBLIC_URL is ${process.env.PUBLIC_URL}.`)
if (process.env.PUBLIC_URL === ""){
    const delay = new Promise((res, rej) => setTimeout(res, 5000))

    import('fetch-mock').then( () => fetchMock.get("glob:https://studies.civilservant.io/5qop/api/task/next/*", exampleNextTask),
        fetchMock.get("https://studies.civilservant.io/5qop/api/initial-data/pl/123", exampleInitialData),
        fetchMock.get("https://studies.civilservant.io/5qop/api/initial-data/fa/123", exampleInitialDataFA),
        fetchMock.get("https://studies.civilservant.io/5qop/api/initial-data/pl/456", exampleInitialDataActivity),
        fetchMock.get("https://studies.civilservant.io/5qop/api/initial-data/fa/456", exampleInitialDataActivityFA),
        fetchMock.get("https://studies.civilservant.io/5qop/api/initial-data/fa/789", 401),
        fetchMock.get("glob:https://studies.civilservant.io/5qop/api/initial-data/*", exampleInitialData),
        // fetchMock.get("glob:https://studies.civilservant.io/5qop/api/initial-data/*", delay.then(()=>(exampleInitialDataFA))),
        fetchMock.get("glob:https://studies.civilservant.io/5qop/api/task/skip/*", {'success': true}),
        // fetchMock.get("glob:https://studies.civilservant.io/5qop/api/diff/thank/*", {'success': false, 'error': 'the world is broken'}),
        fetchMock.get("glob:https://studies.civilservant.io/5qop/api/diff/thank/*", {'success': true}),
        fetchMock.get("glob:https://studies.civilservant.io/5qop/api/activityComplete/*", {'success': true}),
        fetchMock.get("glob:https://studies.civilservant.io/5qop/api/logout/*", {'success': true}),
    )
}


const apiHost = "https://studies.civilservant.io/5qop/api";
const contactEmail = 'max.klein@civilservant.io';


function handleErrors(response, props) {
    if (response.ok){
        console.log("Response was ok and it was: ", response)
    }
    if (!response.ok) {
        // throw Error(response.statusText);
        console.log(`Response error is :`, response)
        toast.error(`Please email ${contactEmail} about this error: Response was not ok. 
            Context: response status is ${response.status}`,  {autoClose:false, closeOnClick:false, draggable:false})
        if (response.status===401){
            console.log("Got a 401 error. Prop  s are:", props)
            window.location = `${props.serverSubDir}/splash/`
        }
        toast.error(`There was a network error, please try again in a few seconds. `, {autoClose:6000})
    }
    return response;
}

export function getSingleTaskDatum(lang, userId, cb) {
    // get a next item to add to the queue
    fetch(`${apiHost}/task/next/`).then(handleErrors).then(function (response) {
        response.json().then(function (data) {
            console.log('in user data, data is:', data);
            if (data.success){
                cb(data.taskData)
            }
            else {
                // TODO handle this more gracefully
                console.error("We didn't get a sucessful return")
            }
        });
    })
}

export function getInitialData(lang, userId, cb, props) {
    //get the first metadata and first two items
    fetch(`${apiHost}/initial-data/`).then((response) => handleErrors(response, props)).then(function (response) {
        response.json().then(function (data) {
            // console.log('in user data, data is:', data);
            cb(data)
        });
    })
}

export function sendThanks(lang, revId, thankingUserId, cb) {
    fetch(`${apiHost}/diff/thank/${revId}`).then(handleErrors).then(function (response) {
        response.json().then(function(data){
            if (data.success){cb(revId)}
            else {toast.error(`Please email ${contactEmail} about this error: ${data.error}. \n\n 
            Context: sendThanks. lang:${lang}. revId:${revId}, thankingUserId:${thankingUserId}`,
                {autoClose:false, closeOnClick:false, draggable:false})}
        })
    })
}

export function skipThanks(lang, thankeeUserId, thankingUserId, cb) {
    console.log("SKIP API CALL BEING MADE")
    fetch(`${apiHost}/task/skip/${thankeeUserId}`).then(handleErrors).then(function (response) {
        response.json().then(function (data) {
            if (data.success){cb()}
            else {toast.error(`Please email ${contactEmail} about this error: ${data.error}. 
            Context: skipThanks. lang:${lang}. thankeeUserId${thankeeUserId}, thankingUserId${thankingUserId}`,
                {autoClose:false, closeOnClick:false, draggable:false})}
        })
    })
}


export function logOut(lang, userId, cb) {
    fetch(`${apiHost}/logout/`).then(handleErrors).then(function (response) {
        console.log("signed out user");
        cb()
    })
}


export function sendActivityComplete(lang, userId, cb) {
    // tells the back end
    fetch(`${apiHost}/activity/complete/`).then(handleErrors).then(function (response) {
        response.json().then(function (data) {
            cb(data);
        })
    })
}
