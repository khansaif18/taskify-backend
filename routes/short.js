import { Router } from 'express'
import { Url } from '../models/url.js';

export const shortRoute = Router()

shortRoute.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const date = new Date();
    try {
        const entry = await Url.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: date.toLocaleDateString() 
                    }
                }
            },
            { new: true }
        );
        if (!entry) {
            return res.status(404).json({ error: 'Short URL not found' }); 
        }

        res.redirect(entry.redirectUrl);
    } catch (error) {
        res.status(500).json({ error: 'Could not redirect, try again' });
    }
})