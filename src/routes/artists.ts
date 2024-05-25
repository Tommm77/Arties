import * as fs from 'fs';
import {Request, Response} from 'express';

const artists = JSON.parse(fs.readFileSync('artists.json', 'utf-8'));
const events = JSON.parse(fs.readFileSync('events.json', 'utf-8'));
const occurrences = JSON.parse(fs.readFileSync('occurrences.json', 'utf-8'));

export const getArtistById = (req: Request, res: Response) => {
    const artistId = parseInt(req.params.id, 10);
    const artist = artists.find((a: { id: number }) => a.id === artistId);

    if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
    }

    const responseArtist = { ...artist };

    if (req.query.withEvents === 'true') {
        const now = new Date();
        responseArtist.events = events
            .filter((event: { artist: number }) => event.artist === artistId)
            .map((event: { id: number; }) => {
                const eventOccurrences = occurrences
                    .filter((occ: {
                        event: number,
                        time: string
                    }) => occ.event === event.id && new Date(occ.time) > now);
                return {
                    ...event,
                    occurrences: eventOccurrences
                };
            })
            .filter((event: { occurrences: string | any[]; }) => event.occurrences.length > 0);
    } else {
        return res.status(403).json({ error: 'Invalid query parameter: withEvents' });
    }

    res.json(responseArtist);
};
