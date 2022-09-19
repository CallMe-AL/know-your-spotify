import { useState, useEffect } from 'react';
import WinningSongInfo from "./WinningSongInfo";

const Choice = (props) => {

  const [choice, setChoice] = useState('choice');

  // const [albumArt, setAlbumArt] = useState(albumArt1);

  const id = props.song.track.id;
  const albumArt2 = props.song.track.album.images[2].url;
  const albumArt1 = props.song.track.album.images[1].url;
  const albumArt0 = props.song.track.album.images[0].url;

  const compareSongs = (id) => {
    if (props.gameStart) {
      if (id === props.winningSong.track.id) {
        setChoice('choice correct');
        props.setGameInfo('Nice!!');
        props.setWinCondition(true);
        props.setGameStart(false);
        props.setScore(props.score + props.points);
      } else {
        props.setPoints(props.points - 2);
        setChoice('choice wrong');
        props.setGameInfo('Nope!');
      }
    }
  }

  useEffect(() => {
    setChoice('choice');
  }, [props.winningSong]);

  useEffect(() => {
    if (props.points === 0 || props.timeLeft === 0) {
      if (id === props.winningSong.track.id) {
        setChoice('choice correct');
        props.setGameInfo('This was the right one :(');
        props.setGameStart(false);
      }
    }
  }, [props.points, props.timeLeft]);

  return (
    
    <div className={choice} onClick={() => compareSongs(id)}>
      <img src={albumArt1} alt="album image" />
      {choice === 'choice correct' && 
            <WinningSongInfo 
                name={props.winningSong.track.name} 
                artist={props.winningSong.track.artists[0].name} 
                album={props.winningSong.track.album.name} 
                released={props.winningSong.track.album.release_date}
            />
      }
    </div>
  )
}

export default Choice
