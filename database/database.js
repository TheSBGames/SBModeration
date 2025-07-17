const mongoose = require('mongoose');

module.exports = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.warn('[DATABASE] MongoDB URI is missing in .env');
        return;
    }

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('[DATABASE] MongoDB connected successfully.');
    } catch (error) {
        console.error('[DATABASE] Connection error:', error);
    }
};
