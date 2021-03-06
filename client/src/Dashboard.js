import useAuth from "./custom_hooks/useAuth";
import SpotifyWebApi from "spotify-web-api-js";
import { useEffect, useState } from "react";
import ListItem from "./ListItem";
import Rules from './Rules';

const spotify = new SpotifyWebApi();

const Dashboard = (props) => {

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [appearance, setAppearance] = useState('rules hide');

  const accessToken = useAuth(props.code);

  useEffect(() => {
    if(!accessToken) return;
    spotify.setAccessToken(accessToken);
  }, [accessToken]);
  
  useEffect(() => {    
    spotify.getUserPlaylists()
      .then((data) => {
        console.log('user playlists', data);
        setPlaylists(data.items);
      }, 
      function(err) {
        console.error(err);
      })
  }, [accessToken]);

  const choosePlaylist = (id) => {
    setSelectedPlaylist(id);
    console.log(id);
  }

  return (
    <>      
      <div className="dashboard-wrap">
        <Rules appearance={appearance} setAppearance={setAppearance}/>
        <h1>Choose your playlist to get started!</h1>
        
        <div className="playlist-container">
          {playlists && playlists.map(list => {
            return (
            <ListItem 
              imgUrl={list.images[0].url}
              accessToken={accessToken}
              name={list.name}
              uri={list.uri}
              key={list.id}
              id={list.id}
              onClick={choosePlaylist}
              href={list.href} /> )
          })}        
        </div>
        <button className="rules-container" onClick={() => setAppearance('rules show')}>
            <h2>Rules</h2>
            <i className="fas fa-bars"></i>
        </button>
      </div>    
    </>
  )
}

export default Dashboard
