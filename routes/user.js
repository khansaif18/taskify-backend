import { Router } from 'express'
import { User } from '../models/user.js'
import { createTokenForUser } from '../services/authentication.js'

export const userRoute = Router()

userRoute.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        const ifEmailExists = await User.findOne({ email: email })

        if (ifEmailExists) {
            return res.json({ error: "email already exists" })

        } else {
            const newUser = await User.create({
                fullName,
                email,
                password
            })
            const token = createTokenForUser(newUser)
            return res.cookie('token', token, {
                sameSite: 'none',
                secure: true, // Ensure this is true when using HTTPS
                httpOnly: true, // This will make sure the cookie is only accessible via HTTP(S)
                domain: '.vercel.app', // Use a domain pattern that works for subdomains
                path: '/', // Make the cookie available across your entire app
            }).json({ status: 'successful', user: newUser })

        }

    } catch (error) {
        console.log('signup error', error);
        return res.json({ error: "some error occured" })
    }
})

userRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndCreateToken(email, password);

        // return res.cookie('token', token, { sameSite: 'none', domain: 'https://linktrim-saif.vercel.app/login' }).json({ status: 'Signed In Successfully' });;

        return res.cookie('token', token, {
            sameSite: 'none',
            secure: true, // Ensure this is true when using HTTPS
            httpOnly: true, // This will make sure the cookie is only accessible via HTTP(S)
            domain: '.vercel.app', // Use a domain pattern that works for subdomains
            path: '/', // Make the cookie available across your entire app
        }).json({ status: 'successful', user: newUser })


    } catch (error) {
        console.error('Error in login:', error.message);
        return res.status(401).json({ error: error.message });
    }
});



userRoute.get('/logout', (req, res) => {
    try {
        res.clearCookie('token').json({ status: 'Logged Out Successfully' })
    } catch (error) {
        res.status(400).json({ error: 'Could not Log Out, Try Again' })
    }
})