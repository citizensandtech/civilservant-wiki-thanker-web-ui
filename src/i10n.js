import i10ns from './assets/i10n/gratitude_internationalizations.csv.index'

export function i10n(label, lang = 'en', args = []) {
    if (typeof(args) == "string" || typeof(args)=="number"){
        args=[args]
    }
    let fmtStr = `no such thing as ${label}`;
    try {
        fmtStr = i10ns[label][lang];
    }
    catch (err) {
        console.error('no such thing as ', label)
    }
    for (let i = 0; i < args.length; i++) {
        fmtStr = fmtStr.replace(`{${i}}`, args[i]);
    }
    return fmtStr
}
