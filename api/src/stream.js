import fs, { createWriteStream, write } from 'fs';
import torrentStream from 'torrent-stream';

import searchTorrent from './searchengine/torrentSearchEngine';

// @TODO add torrent-stream tmp path to environnement variables
const TORRENT_STREAM_PATH = `/tmp/torrent-stream`;
const TORRENT_STREAM_TORRENTS_PATH = `/torrent-stream-torrents`;
const MOVIES_PATH = `/tmp`;
const CHUNK_LENGTH = 6000000;

const stream = {
    engines: {},
    extensionsRegex: /^.*\.(mov|avi|wmv|flv|3gp|mp4|mpg|mkv)$/i,

    async _get(imdbID, resolution) {
        const engineKey = `${imdbID}:${resolution}`;

        if (this.engines[engineKey])
            return Promise.resolve(this.engines[engineKey].file);

        if (fs.existsSync(`${MOVIES_PATH}/${engineKey}`)) {
            return Promise.resolve({
                createReadStream: opts =>
                    fs.createReadStream(`${MOVIES_PATH}/${engineKey}`, opts),
                name: `${MOVIES_PATH}/${engineKey}`,
                length: fs.statSync(`${MOVIES_PATH}/${engineKey}`).size
            });
        }
    
        return new Promise(async (resolve) => {
            const { [resolution]: torrent } = await searchTorrent.getTorrents({ imdbID });

            this.engines[engineKey] = torrentStream(torrent.magnet, {
                path: `${TORRENT_STREAM_PATH}/${imdbID}/${resolution}`,
                name: `${TORRENT_STREAM_TORRENTS_PATH}/${imdbID}/${resolution}`,
                uploads: 0,
                connections: 500
            });

            this.engines[engineKey].on('ready', () => {
                this.engines[engineKey].files.forEach(file => {
                    if (!this.extensionsRegex.test(file.name))
                        return file.deselect();
                    file.select();
                    this._saveFile(file, engineKey);
                    this.engines[engineKey].file = file;
                    resolve(this.engines[engineKey].file);
                })
            })
        });
    },

    _saveFile(file, engineKey) {
        const writeStream = createWriteStream(`${MOVIES_PATH}/${engineKey}`);

        writeStream.on('finish', () =>
            this.engines[engineKey].remove(() => (
                this.engines[engineKey].destroy(),
                delete this.engines[engineKey]
            )))

        file.createReadStream().pipe(writeStream);
    },

    _setEvents(readable, res, req) {
        readable.on('end', () => res.end())
        readable.on('error', e => res.end(e))

        req.on('abort', () => readable.destroy());
    },

    _writeResHeaders(res, start, end, size) {
        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Type': 'video/mp4'
        });
    },

    _pipeFileStream(readable, res) {
        readable.pipe(res)
    },

    _isRequestHasValidParams({ params: { imdbID, resolution } }) {
        return (imdbID && imdbID.length && resolution && resolution.length
            && ['720p','1080p'].includes(resolution));
    },

    _isRequestHasRangeHeader(req) {
        return req.get('Range');
    },

    async middleware(req, res) {
        if (!this._isRequestHasValidParams(req))
            return res.sendStatus(400);
        if (!this._isRequestHasRangeHeader(req))
            return res.sendStatus(416);

        const range = req.get('Range');
        const { imdbID, resolution } = req.params;

        let [,start, end] = range
            .match(/bytes=([0-9]+)?-([0-9]+)?/)
            .map((e, i) => i && e && parseInt(e));
        
        const file = await this._get(imdbID, resolution);
        
        end = end || (start + CHUNK_LENGTH > file.length - 1 ? file.length - 1 : start + CHUNK_LENGTH);
        
        const readable = file.createReadStream({ start, end });

        this._setEvents(readable, res, req);
        this._writeResHeaders(res, start, end, file.length);
        this._pipeFileStream(readable, res);
    }
}

process.on('beforeExit', () =>
    stream.engines.forEach(engine => engine.destroy()))

export default stream;