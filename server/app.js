const express = require('express');
const blockRoutes = require('./routes/blockRoutes');

// const fetchBlockDetails = async () => {
//     try {
//         console.log('Attempting to subscribe to new block headers...');
//         const subscription = await web3.eth.subscribe("newBlockHeaders", function (error, result) {
//             console.log("I reached");
//             console.log(result);
//             if (error) {
//                 console.error("Error", error);
//             }
//         })
//     } catch (error) {
//         console.error('Error fetching block details:', error.message);
//     }
// }



const app = express();

app.use(express.json());

app.use('/api/v1/blocks', blockRoutes);

// fetchBlockDetails();



app.listen(3000, () => {
    console.log("Server is running at port 3000");
})