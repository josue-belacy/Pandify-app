require('dotenv').config();
const queryString = require('querystring');
const axios = require('axios');
const express = require('express');
const app = express();


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET =  process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const stateKey = 'spotify_auth_state'


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


app.get('/', (req,res) =>  {
    const data = {
        name: req.query.name,
        age: 19,
    }
    res.json(req.query);
})


app.get('/login', (req,res) =>  {
    const state  = makeid(16);
    res.cookie(stateKey,state);

    res.redirect(
      `https://accounts.spotify.com/authorize/?` +
        queryString.stringify({
          response_type: "code",
          client_id: CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          scope: "user-read-private user-read-email, user-top-read",
          state: state,
        })
    ); 
})

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: queryString.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;

        res.redirect(
          "http://localhost:3000/?" +
            queryString.stringify({
              access_token,
              refresh_token,
              expires_in,
            })
        );
      } else {
        res.send(
          res.redirect(
            "http://localhost:3000/?" +
              queryString.stringify({
                error: "invalid_token",
              })
          )
        );
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: queryString.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

const PORT = 8888 || process.env.PORT;

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));