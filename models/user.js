import mongoose from "mongoose";
import { createHmac, randomBytes } from 'crypto'
import { createTokenForUser } from "../services/authentication.js";

const avatarUrl = 'https://img.freepik.com/premium-photo/lego-figure-boy-wearing-glasses-jacket-with-hoodie-it_113255-92731.jpg?size=626&ext=jpg'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: avatarUrl
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    }
}, { timestamps: true })

userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next()
})

userSchema.static('matchPasswordAndCreateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User Not Found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidesHash = createHmac("sha256", salt).update(password).digest('hex');

    if (hashedPassword !== userProvidesHash) {
        throw new Error('Incorrect Password');
    }

    const token = createTokenForUser(user)
    return token
});

export const User = mongoose.model('user', userSchema)