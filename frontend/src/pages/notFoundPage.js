import {Link} from "react-router";

function NotFoundPage() {
  return (
    <div>
      <div>
        <h1>404 Error</h1>
      </div>
      <div>
        <Link to="/">Back to Homepage</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;