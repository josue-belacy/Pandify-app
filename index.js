require('dotenv').config()
const express = require('express')
const queryString = require('query-string');
const app = express();
const axios = require('axios');
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

/** 
 * Generates a random string containing numbers and letters
 * @param {number} length The length of the string 
 * @return {string} The generated string 
*/

const generatedRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i=0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
  const state = generatedRandomString(16);
  res.cookie(stateKey, state);

const scope = 'user-read-private user-read-email';

  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  })

  res.redirect(`https://accounts.spotify.com/authorize?$
  {queryParams}`);
  
  app.get('/callback', (req, res) => {
    const code = req.query.code || null;
  
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        if (response.status === 200) {
          res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        } else {
          res.send(response);
        }
      })
      .catch(error => {
        res.send(error);
      });
  });

  app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;
  
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
  });

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
})
