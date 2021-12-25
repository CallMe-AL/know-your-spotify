const GameInfo = (props) => {
  return (
    <div className="game-info">
      <ul className="game-info-list">
        <li>Score: {props.score}</li>
        <li>Possible points: {props.points}</li>
        <li>Songs remaining: {props.songs.length}</li>
      </ul>
    </div>
  )
}

export default GameInfo
