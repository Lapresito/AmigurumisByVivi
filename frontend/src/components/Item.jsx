import {Link} from 'react-router-dom'

const Item = ({ id, title, category, thumbnail }) => {
  thumbnail = 'https://picsum.photos/200/300'
  return (
    <div>
        <div key={id}>
            <h3>{title}</h3>
            <img src={thumbnail} alt={title} />
            <p>{category}</p>
            <Link to={`/item/${id}`}>Details</Link>
        </div>
    </div>
  )
}

export default Item