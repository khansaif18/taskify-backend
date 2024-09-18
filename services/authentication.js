import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const secretKey = process.env.JWT_SECRET_KEY
// const secretKey = '@Noob6900'

export const createTokenForUser = (user) => {
    const payload = {
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role
    };

    try {
        const token = jsonwebtoken.sign(payload, secretKey, { expiresIn: '1w' }); // Token expires in 1 week
        return token;
    } catch (error) {
        console.error('Error creating token:', error.message);
        throw new Error('Token creation failed');
    }
};

export const validateToken = (token) => {
    try {
        const payload = jsonwebtoken.verify(token, secretKey);
        return payload;
    } catch (error) {
        console.error('Error validating token:', error.message);
        throw new Error('Invalid token');
    }
};
