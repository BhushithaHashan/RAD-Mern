const express = require('express'); // Import the express library
const app = express();              // Create the app instance


app.use(express.json()); 


app.get('/ping', (req, res) => {
    res.send("Pong! The server is alive.");
});
app.get('/hello/:username',(req,res)=>{
    const username = req.params.username
    res.send(`user ${username},this is hello from the server`)
})
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});