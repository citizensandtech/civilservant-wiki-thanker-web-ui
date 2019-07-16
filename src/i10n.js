import React from 'react'
import i10ns from './assets/i10n/gratitude_internationalizations.csv.index'

export function i10n(label, lang = 'en', args = []) {
    if (typeof(args) == "string" || typeof(args)=="number"){
        args=[args]
    }
    let fmtStr = `${label}`;
    try {
        fmtStr = i10ns[label][lang];
    }
    catch (err) {
        // no localized label, try to fallback to english
        try {
            fmtStr = i10ns[label]['en']
        }
        catch (err){
            // nothing to do so label key is returned
        }
    }
    for (let i = 0; i < args.length; i++) {
        fmtStr = fmtStr.replace(`{${i}}`, args[i]);
    }
    if (fmtStr.indexOf('\n') < 0){
        // if there are no newlines in the string just return it. useful for buttons
        return fmtStr
    } else{
        // if there are newlines wrap it in a linkbreaker
        const text = <div className={"display-linebreak"}>{fmtStr}</div>;
        return text
    }
}
