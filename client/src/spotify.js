// *** authorization ***
const authEndPoint = "https://accounts.spotify.com/authorize";
const client = 'ba9ef6d00c7046d099fbee065ab281d1';
const redirect = 'http://localhost:3001/callback';
const state = require("crypto").randomBytes(64).toString('hex');

// application requests authorization
const scopes = [
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
export const auth_url = `${authEndPoint}?response_type=code&client_id=${client}&scope=${scopes.join("%20")}&redirect_uri=${redirect}&state=${state}&show_dialogue=true`;


// export const getCodeFromUrl = () => {
//   const params = new URLSearchParams(window.location.search);
//   const code = params.get("code");
//   const returnedState = params.get("state");  

//   if (returnedState === null) {
//     return false;
//   } else {
//     return code;
//   }

  
// }