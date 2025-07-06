import "../styles/Card.css";
import { useNavigate } from "react-router-dom";

function Card({ title, image, description }) {
  const navigate = useNavigate();
  
  const getTopicKey = (title) => {
    const topicMap = {
      "Implementation": "implementation",
      "Dynamic Programming": "dp",
      "Data Structures": "datastructures",
      "Algorithms": "algorithms",
      "Mathematics": "math",
      "Graph Theory": "graphtheory"
    };
    return topicMap[title] || title.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/topic/${getTopicKey(title)}`)}
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