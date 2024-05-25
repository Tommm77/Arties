import { Request, Response } from 'express';
import * as fs from 'fs';

const occurrences = JSON.parse(fs.readFileSync('occurrences.json', 'utf-8'));
const events = JSON.parse(fs.readFileSync('events.json', 'utf-8'));

export const getOccurrences = (req: Request, res: Response) => {
    const { from, to, withEvent } = req.query;
    if (!from || !to) {
        return res.status(403).json({ error: 'Missing required query parameters: from and to' });
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(403).json({ error: 'Invalid date format' });
    }

    const filteredOccurrences = occurrences.filter((occ: { event: number, time: string }) => {
        const time = new Date(occ.time);
        return time >= fromDate && time <= toDate;
    });

    if (withEvent === 'true') {
        const populatedOccurrences = filteredOccurrences.map((occ: { event: number, time: string }) => {
            const event = events.find((e: { id: number }) => e.id === occ.event);
            return { ...occ, event };
        });
        res.json(populatedOccurrences);
    } else if (withEvent !== undefined && withEvent !== 'false') {
        return res.status(403).json({ error: 'Invalid query parameter: withEvent' });
    } else {
        res.json(filteredOccurrences);
    }
};
