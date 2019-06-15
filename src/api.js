// Sending Functions

export function sendThanks(thankeeId, revId, lang) {
    // alert(`would now be sending thanks to ${revId} on lang ${lang} from user ${userId}`);
    return true
}

export function skipThanks(revId, lang, userId) {
    // alert(`would now be skipping thanks to ${revId} on lang ${lang} from user ${userId}`);
    return true
}

// Receiving Functions

export function getInitialData(cb){
    //get the first metadata and first two items
    fetch("https://wikithankerapi.civilservant.io/api/getInitialData").then(function(response){
        response.json().then(function(data){
            console.log('in user data, data is:', data)
            cb(data)});
    })
}

export function getNewTask(cb){
    getSingleTaskDatum('test_data/pl_451404.json', cb)
    }

export function getSingleTaskDatum(cb){
    // gets data about the users to be thanked, called once at the beginning
    fetch("https://wikithankerapi.civilservant.io/api/userData").then(function(response){
        response.json().then(function(data){
            console.log('in user data, data is:', data)
            cb(data)});
    })
}

//TODO: fill this out via the contracts described here: https://docs.google.com/document/d/1ysvqJ9XO4jg8bOIazmh-ZHy95b5O1c8eevu1nh_dC6k/edit
