require('dotenv').config()
const express = require('express')
const app = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_URI = process.env.CLIENT_URI;

app.get('/', (req, res ) => {
  const data = {
    name: 'Pandify',
    isAwesome: true
  };

  res.json(data);
});

app.get('/login', (req, res) => {
  res.send(`Log in to Spotify`);
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
})
