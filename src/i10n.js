import i10ns from './assets/i10n/gratitude_internationalizations.csv.index'

export function i10n(label, lang='en', args) {
    let fmtStr = `no such thing as ${label}`
    try {
    fmtStr = i10ns[label][lang];}
    catch(err){
        console.error('no such thing as ', label)
    }
    const text = fmtStr.replace('{x}', args);
    return text
}
