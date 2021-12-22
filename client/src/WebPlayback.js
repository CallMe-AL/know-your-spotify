import React, { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import { Link } from 'react-router-dom';


const WebPlayback = (props) => {

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(null);
  const [devId, setDevId] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [winningUri, setWinningUri] = useState(props.uri);

  const spotify = new SpotifyWebApi();

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(props.token) },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        
        const id = device_id;
        setDevId(id);
        setPlayerReady(true);
      });      

      player.addListener('initialization_error', ({ message }) => { 
        console.error(message);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', ( state => {

        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then( state => { 
            (!state)? setActive(false) : setActive(true) 
        });

      }));

      player.connect();

    };

  }, []);

  useEffect(() => {

    if (!playerReady) return;

    spotify.play({ device_id: devId, uris: [winningUri], position_ms: 60000 }, function(err) {
      if (err) {
        console.log(err);
      }
    });
    
  }, [playerReady, winningUri]);

  useEffect(() => {
    setWinningUri(props.uri);
  }, [props.uri]);

  return (
    <div className="player-container">
      <Link className="dashboard-return" to="/" onClick={() => { player.disconnect() }}><i className="fas fa-chevron-left"></i>Return home</Link>
      <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
        { is_paused ? <i class="fas fa-play"></i> : <i class="fas fa-pause"></i> }
      </button>
    </div>
  )
}

export default WebPlayback
