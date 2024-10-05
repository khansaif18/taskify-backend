import rateLimit from 'express-rate-limit';


export const checkUidInHeader = (req, res, next) => {
    const uid = req.headers.authorization?.split('Bearer ')[1];

    if (!uid) {
        return res.status(401).json({ error: "Unauthorized, You Don't have access to this route" });
    }

    req.uid = uid;

    next();
};


export const checkUidInBody = (req, res, next) => {
    const { uid } = req.body;

    if (!uid) {
        return res.status(401).json({ error: "Unauthorized, You Don't have access to this route" });
    }

    req.uid = uid;

    next();
};



export const getTimeAndDate = () => {
    let date = new Date();

    let options = { timeZone: 'Asia/Kolkata', hour12: true };
    let dateString = date.toLocaleString('en-GB', options).split(', ');
    let [dayMonthYear, time] = dateString;

    return `${dayMonthYear}, ${time}`;
};


export const taskLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again after 30 minutes'
});


