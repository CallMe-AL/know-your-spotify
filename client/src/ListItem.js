import { Link } from 'react-router-dom';

const ListItem = (props) => {
  return (
    <Link 
      to="game"
      state={{ id: props.id }}
      className="item-container"
      // onClick={() => props.onClick(props.id)}
    >
      <img src={props.imgUrl} alt={`Playlist icon for ${props.name}`} />
      <div>{props.name}</div>
    </Link>
  )
}

export default ListItem
