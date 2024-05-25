import * as fs from 'fs';
import {Request, Response} from 'express';

const events = JSON.parse(fs.readFileSync('events.json', 'utf-8'));
const artists = JSON.parse(fs.readFileSync('artists.json', 'utf-8'));
const occurrences = JSON.parse(fs.readFileSync('occurrences.json', 'utf-8'));

export const getEventById = (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
        return res.status(403).json({ error: 'Invalid event ID' });
    }

    const event = events.find((e: { id: number }) => e.id === eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    const responseEvent = { ...event };

    if (req.query.withArtist === 'true') {
        const artist = artists.find((artist: { id: number }) => artist.id === event.artist);
        if (artist) {
            responseEvent.artist = artist;
        }
    } else if (req.query.withArtist !== undefined && req.query.withArtist !== 'false') {
        return res.status(403).json({ error: 'Invalid query parameter: withArtist' });
    }

    res.json(responseEvent);
};

export const getEventsByDateRange = (req: Request, res: Response) => {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(403).json({ error: 'Missing required query parameters: from and to' });
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(403).json({ error: 'Invalid date format' });
    }

    const filteredEvents = events.map((event: { id: number; }) => {
        const eventOccurrences = occurrences.filter((occ: { event: number, time: string }) => {
            const time = new Date(occ.time);
            return occ.event === event.id && time >= fromDate && time <= toDate;
        });

        if (eventOccurrences.length > 0) {
            return { ...event, occurrences: eventOccurrences };
        }
        return null;
    }).filter((event: null) => event !== null);

    res.json(filteredEvents);
};


