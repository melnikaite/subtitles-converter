const parser = require('fast-xml-parser');
const fs = require('fs');
const moment = require('moment');

const formatTime = (raw) => {
    const seconds = Math.round(raw.replace('t', '') / 1000000000 * 60);
    const time = moment('2000-01-01').startOf('day').seconds(seconds);
    return time.format('HH:mm:ss');
};

const xmlData = fs.readFileSync('./input.xml').toString();
const subtitles = parser.parse(xmlData, {ignoreAttributes: false}).tt.body.div.p;
const formattedSubtitles = subtitles.map(s => {
    if (!s.span) {
        return `${formatTime(s['@_begin'])} ${s['#text']}\n`;
    } else {
        if (!s.span.map) {
            return `${formatTime(s['@_begin'])} ${s.span['#text']}\n`;
        }
        return s.span.map(ss => {
            return `${formatTime(s['@_begin'])} ${ss['#text']}\n`;
        }).join('');
    }
});
fs.writeFileSync('./output.txt', formattedSubtitles.join(''));
