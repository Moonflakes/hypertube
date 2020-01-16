import { spawn } from 'child_process';
import { createWriteStream, createReadStream, existsSync } from 'fs'
import { redisPromise } from '../redis'

let ffmpegs = {};

function createReadStreamFromMovieTrailerUrl(url) {
    return spawn('ffmpeg', [
        '-hide_banner', '-loglevel', 'panic',
        '-i', `cache:${url}`,
        '-preset', 'ultrafast',
        '-vf', 'crop=1280:528:0:96',
        "-movflags", "frag_keyframe+empty_moov+faststart",
        '-c:a', 'copy',
        '-f', 'mp4',
        'pipe:1'
    ])
}

export default async function middleware(req, res) {
    const { imdbID } = req.params;
    
    if (!imdbID || !imdbID.length)
        return res.sendStatus(400);
    
        
    if (!ffmpegs[imdbID] && existsSync(`/tmp/trailer::${imdbID}`))
        return (
            res.append('Content-Type', 'video/mp4'),
            createReadStream(`/tmp/trailer::${imdbID}`).pipe(res)
        );
        
    let trailer = await redisPromise.get(`trailer::${imdbID}`);
        
    if (!trailer)
        return res.sendStatus(404);

    res.append('Content-Type', 'video/mp4')

    const ffmpeg = createReadStreamFromMovieTrailerUrl(trailer)

    ffmpeg.stdout.pipe(res)

    if (!ffmpegs[imdbID]) {
        ffmpegs[imdbID] = ffmpeg;

        ffmpegs[imdbID].stdout.pipe(createWriteStream(`/tmp/trailer::${imdbID}`))

        ffmpegs[imdbID].on('exit', () => (
            ffmpegs[imdbID].kill('SIGINT'),
            delete ffmpegs[imdbID]
        ));
    } else{
        req.on('abort', () => ffmpeg && ffmpeg.kill('SIGINT'))
        ffmpeg.on('exit', () => ffmpeg && ffmpeg.kill('SIGINT'));
    }
}

process.on('beforeExit', () => (ffmpegs.map(ffmpeg => {
    ffmpeg.kill('SIGINT');
    return null;
})))