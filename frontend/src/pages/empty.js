import "../styles/homePage.css";
import { Link } from "react-router";

function Empty() {
  return (
    <div className="title-container">
      <div className="title">
        <Link to="/">Back to Homepage</Link>
      </div>
     
    </div>
  );
}

export default Empty;