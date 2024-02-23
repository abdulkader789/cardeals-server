const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const cookieParser = require('cookie-parser');
const app = express();
const connectDB = require('./db/connect');
const cors = require('cors');
const authRouter = require('./routes/auth.router')
// const categoryRouter = require('./routes/category.router')
// const productRouter = require('./routes/product.router')
const userRouter = require('./routes/user.router')
// const orderRouter = require('./routes/order.router')

// Middleware
app.use(express.json({ limit: '32kb' })); // Increased limit to 32kb
app.use(express.urlencoded({ extended: true, limit: '32kb' })); // Increased limit to 32kb and extended to true
app.use(cors({ origin: true, credentials: true })); // Set origin and credentials true for CORS
app.use(cookieParser());




app.use('/api/v1/auth', authRouter)
// app.use('/api/v1/category', categoryRouter)
// app.use('/api/v1/product', productRouter)
app.use('/api/v1/user', userRouter)
// app.use('/api/v1/order', orderRouter)


// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });