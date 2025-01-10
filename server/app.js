const express = require('express');
const blockRoutes = require('./routes/blockRoutes');
const accountRoutes = require('./routes/accountRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const blockHelper = require('./blockHelper');
require("dotenv").config();


// Update the database each time the server is turned on
blockHelper.storeBlockDetails();

// Update the database each time a new block is mined on the chain
blockHelper.fetchLatestBlock();

const app = express();

app.use(express.json());

app.use('/api/v1/blocks', blockRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/tokens', tokenRoutes);


app.listen(3000, () => {
    console.log("Server is running at port 3000");
})