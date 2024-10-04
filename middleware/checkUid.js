
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

    let date = new Date()

    let day = date.getDate()
    day = day < 10 ? '0' + day : day

    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month

    let year = date.getFullYear()

    let hour = date.getHours()
    hour = hour < 10 ? '0' + hour : hour

    let minute = date.getMinutes()
    minute = minute < 10 ? '0' + minute : minute

    let second = date.getSeconds()
    second = second < 10 ? '0' + second : second

    let dateAndTime = `${day}/${month}/${year}, ${hour}:${minute}:${second}`.toString()

    return dateAndTime
}
