// express stuff
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const request = require('postman-request');
const { stat } = require('fs');
require('dotenv').config();

// env stuff
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const PORT = process.env.PORT || 3001;

const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(path.resolve(__dirname, 'client/public')))
   .use(cookieParser())
   .use(cors({credentials: true, origin: redirectUri}))   
   .use(express.json())
   .use(express.urlencoded({ extended: true }));


// Serve any static files
// app.use(express.static(__dirname, 'client/public'));
// // Handle React routing, return all requests to React app
app.get('/*', function(req, res) {
  res.sendFile(__dirname, 'client/public', 'index.html');
});

app.get('/hello', function(req, res) {
  console.log(req.originalUrl);
  res.json({ message: "Hello from server!" });
})

// *** authorization ***
app.get('/login-spotify', function(req, res) {
  console.log('got the request');
  const authEndPoint = "https://accounts.spotify.com/authorize";
  // const state = require("crypto").randomBytes(64).toString('hex');
  const state = generateRandomString(16);
  // res.cookie(stateKey, state, { secure: true, sameSite: true} );

  // application requests authorization
  const scopes = [
  'streaming',
  'ugc-image-upload',
  'user-read-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-read-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
  ];
  scopes.join("%20");
  res.redirect(`${authEndPoint}?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}&show_dialogue=true`);
});

// *** callback ***
app.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  // const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null) {
    res.redirect('/#error=state_mismatch');
  } else {    
    // res.clearCookie(stateKey);
    const authOptions = {
      // note: redirect for validation only
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const resObj = {
          accessToken: body.access_token,
          expiresIn: body.expires_in,
          refreshToken: body.refresh_token
        }
        res.json(resObj);
      } else {
        res.redirect(clientId + '/?error=invalid_token');
      }
    });
  }
});

// requesting access token from refresh token
app.get('/refresh_token', function(req, res) {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('success!');
      const access_token = body.access_token;
      const expires_in = body.expires_in;
      res.send({
        'access_token': access_token,
        'expires_in': expires_in
      });
    } else {
      console.log(response.statusCode);
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});