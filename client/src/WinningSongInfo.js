import { useState } from "react";

const WinningSongInfo = (props) => {

  const [display, setDisplay] = useState('hide');

  const toggleInfo = () => {
    if (display === 'hide') {
      setDisplay('show');
    } else {
      setDisplay('hide');
    }
  }

  return (
    <>
      <button className="toggle-track-info" onClick={toggleInfo}>Song info</button>
      <div className={`song-info ${display}`}>
        <p>Track: {props.name}</p>
        <p>Artist: {props.artist}</p>
        <p>Album: {props.album}</p>
        <p>Released: {props.released}</p>
      </div>
    </>
  )
}

export default WinningSongInfo
