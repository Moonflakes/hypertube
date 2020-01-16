import magnetReq from 'magnet-link';

export function magnetReqPromise(url) {
    return new Promise((resolve, reject) =>
        magnetReq(url, (err, link) => err ? reject(err) : resolve(link)));
}

export function YTSTorrentToMagnet(torrent, imdbID) {
    return `magnet:?xt=urn:btih:${torrent.hash}&dn=${imdbID}&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.internetwarriors.net:1337&tr=udp://tracker.opentrackr.org:1337/announce`
}