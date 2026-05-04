require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkProfile = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne();
        console.log('Current User Profile:');
        console.log(JSON.stringify(user, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkProfile();
