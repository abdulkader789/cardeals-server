const express = require('express');

const app = express();
const connectDB = require('./db/connect');
const cors = require('cors');
const router = require('./routes/auth.router')
const dotenv = require('dotenv')
dotenv.config()
app.use(express.json());
app.use(cors());





app.use('/api/v1/auth', router)




const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();
