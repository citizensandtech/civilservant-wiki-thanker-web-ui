export function sendThanks(revId, lang) {
    alert(`would now be sending thanks to ${revId} on lang ${lang}`);
    return true
}

export function loadDataFromFile(fname, cb) {
    fetch(`./assets/${fname}`).then(function (response) {
        console.log(response)
        return cb(response.json());
    });

}
