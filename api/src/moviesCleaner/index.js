import instance from '../neo4j';
import fs from 'fs';

function cleanerUnwatchedMovies() {
    instance.cypher('MATCH ()-[r:WATCH]-(m:Movie) WITH r, m ORDER BY r.createdAt DESC RETURN head(collect(r.createdAt)) as createdAt, m.imdbID as imdbID')
    .then(res => {
        const d = new Date();
        d.setMonth(d.getMonth()-1);
        const oneMonthBefore = d.getTime();
        res.records.forEach((r, i) => {
            const timestamp = r.get('createdAt').toNumber()
            const imdbID = r.get('imdbID');
            if (timestamp <= oneMonthBefore) {
                const files = fs.readdirSync('/tmp')
                for (const file of files) {
                    if (file.search(imdbID+':') >= 0 ){
                        fs.unlinkSync('/tmp/'+file);
                    }
                }
            }
            
        })
    })
}

export default cleanerUnwatchedMovies;