import "../styles/Card.css";
import { useNavigate } from "react-router-dom";

function Card({ title, image, description }) {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      onClick={() => navigate(`/visualizer/${title.toLowerCase()}`)}
      tabIndex={0}
    >
      <img src={`/assets/${image}`} alt={title} />
      <div className="card-content">
        <h3>{title}</h3>
      </div>
      <div className="card-details">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Card;
