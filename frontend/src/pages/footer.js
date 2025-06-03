import "../styles/footer.css";
import { Link } from "react-router";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-left">
          <span>&copy; Orden der Bierbank GmbH</span>
          </div>
        <div className="footer-right">
          <div>
            <Link to="/impressum">Impressum</Link>
            </div>
            <div>
            <Link to="/privacy">Privacy</Link>
            </div>
            <div>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        </div>
    </footer>
  );
}
export default Footer;
