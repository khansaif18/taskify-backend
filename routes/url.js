import { Url } from '../models/url.js';
import shortid from 'shortid';
import { Router } from 'express'

export const urlRoute = Router()

// handleGenerateNewShortUrl

urlRoute.post('/', async (req, res) => {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });
    if (!body.userId) return res.status(400).json({ error: 'userId is required' });

    try {
        const id = shortid();
        const url = await Url.create({
            shortId: id,
            redirectUrl: body.url,
            createdBy: body.userId,
            visitHistory: [],
        });
        return res.json({ status: 'success', id: id });
    } catch (error) {
        console.error('Error creating URL:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// handleRedirectUsingShortId

// urlRoute.get('/:shortId', async (req, res) => {
//     const shortId = req.params.shortId;
//     const date = new Date();

//     try {
//         const entry = await Url.findOneAndUpdate(
//             { shortId },
//             {
//                 $push: {
//                     visitHistory: {
//                         timestamp: date.toISOString() // Use ISO format for consistency
//                     }
//                 }
//             },
//             { new: true } // Return the updated document
//         );

//         if (!entry) {
//             return res.status(404).json({ error: 'Short URL not found' }); // Handle if entry is not found
//         }

//         res.redirect(entry.redirectUrl);
//     } catch (error) {
//         res.status(500).json({ error: 'Could not redirect, try again' });
//     }
// })

// handleGetUrlUsingId

urlRoute.get('/analytics/:id', async (req, res) => {
    const id = req.params.id
    try {
        const url = await Url.findById(id)
        if (!url) return res.status(404).json({ error: 'url not found' })
        return res.json(url)
    } catch (error) {
        return res.json({ error: 'some error occured ', error })
    }
})

// handlegetUrlsCreatedbyUser

urlRoute.get('/user-url/:id', async (req, res) => {
    const id = req.params.id
    try {
        const userUrls = await Url.find({ createdBy: id })
        if (!userUrls) return res.status(404).json({ status: 'No url found' })
        else return res.status(200).json(userUrls)
    } catch (error) {
        console.log('Error finding user url : ', error);
        return res.status(404).json({ status: 'Some error occured' })
    }
})