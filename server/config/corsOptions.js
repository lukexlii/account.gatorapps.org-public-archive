const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;