import { Link } from "react-router";
import "../styles/homePage.css";

function HomePage() {
  return (
    <div className>
      <div className= "title-container">
        <div className="title">Orden der Bierbank Bingo</div>
      </div>
      <div className="links-container">
        <div className="links">
          <Link to="/bingoLockout">Lockout</Link>
        </div>
        <div className="links">
          <Link to="/bingoNonLockout">Non-Lockout</Link>
        </div>
        <div className="links">
          <Link to="/bingoNonLockoutHighScore">Non-Lockout-HighScore</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
