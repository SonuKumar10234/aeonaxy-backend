require('./connection/configuration');
require('dotenv').config();
const usersRouter = require('./routes/User');

const express = require('express');
const server = express();
const cors = require('cors');

const PORT = process.env.PORT || 8080

// middleware
server.use(cors());
server.use(express.json());
server.use('/users', usersRouter.router)


// running status
server.get('/', (req, resp) => {
    resp.json({ status: 'Server is running.' });
})


// port
server.listen(PORT, () => {
    console.log('server started');
})



