import SpotifyWebApi from "spotify-web-api-js";
import { useEffect, useState } from "react";
import Choice from "./Choice";
import WebPlayback from "./WebPlayback";
import GameInfo from './GameInfo';
import { useLocation } from 'react-router-dom';

const spotify = new SpotifyWebApi();

const Game = (props) => {

  const [songs, setSongs] = useState([]);
  const [gameSongs, setGameSongs] = useState([]);
  const [winningSong, setWinningSong] = useState(null);
  const [gameInfo, setGameInfo] = useState('Hit start game to play!');
  const [gameStart, setGameStart] = useState(false);
  const [winCondition, setWinCondition] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(6);

  const location = useLocation();
  const accessToken = spotify.getAccessToken();
  const { id } = location.state;

  // grabbing playlist's songs
  useEffect(() => {
    if (!id) return;
    spotify.getPlaylistTracks(id)
      .then(data => {
        console.log('songs', data)
        setSongs(data.items);
      })
      .catch(err => {
        console.log(err);
      })
    console.log(songs);
  }, [props.selectedPlaylist]);

  // choosing which albums will be visible during the game
  // picks and removes winning song from current songs list so it won't play again
  const chooseGameSongs = () => {
    let gameSongs = [];

    const winningIndex = Math.floor(Math.random() * songs.length);
    gameSongs.push(songs[winningIndex]);
    setWinningSong(songs[winningIndex]);
    songs.splice(winningIndex, 1);

    for (let i = 0; gameSongs.length < 4; i++) {
      const rndmNum = Math.floor(Math.random() * songs.length);        
      let albumName = songs[rndmNum].track.album.name;

      let albumNames = gameSongs.map(song => {
        return song.track.album.name;
      })

      if (!albumNames.includes(albumName)) {
        gameSongs.push(songs[rndmNum]);
      }
    }
    
    
    return gameSongs;
  }

  const shuffleSongs = (array) => {
    // Fisher-Yates shuffle: https://bost.ocks.org/mike/shuffle/
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        
    }

    return array;
  }

  // choose 4 random songs
  const createGame = () => {
    // prevents user shuffling to a new song
    // no getting out of a round ;)
    if (gameStart) {
      setGameInfo('Please finish the round!');
      return;
    };
    const gameSongs = chooseGameSongs();
    const newGameSongs = shuffleSongs(gameSongs);
    setGameInfo('Guess wisely!');
    setGameSongs(newGameSongs);
    setPoints(6);
    setWinCondition(false);
    setTimeLeft(10);
    setGameStart(true);
  } 

  useEffect(() => {

    if (!gameStart) return;
    let time = timeLeft;
    const countDown = () => {
      time--;
      setTimeLeft(time);
      if (time === 0) {
        setGameInfo('Game over!');
        setGameStart(false);
        return () => clearInterval(interval);
      }
    }

    let interval = setInterval(countDown, 1000);
    return () => clearInterval(interval);
  }, [gameStart]);


  return (
    <div className="game-wrapper">
      <h1>{gameInfo}</h1>
      <h2>{timeLeft}</h2> 
      <div className="choices-wrapper">
      {winningSong && gameSongs.map(song => {
        return <Choice 
                  key={song.track.id}
                  song={song} 
                  winningSong={winningSong} 
                  setPoints={setPoints} 
                  points={points} 
                  score={score}
                  setScore={setScore}
                  setGameInfo={setGameInfo}
                  setGameStart={setGameStart}
                  setWinCondition={setWinCondition}
                  gameStart={gameStart}
                  timeLeft={timeLeft}
                />
        })            
      }   
      </div>
      <button className="game-btn" onClick={createGame}>Start game</button>
      <WebPlayback 
          token={accessToken}
          uri={winningSong?.track.uri}
      />
      <GameInfo score={score} points={points} songs={songs}/> 
    </div>
  )
}

export default Game
