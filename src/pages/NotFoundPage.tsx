import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <section>
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/courses">Go to courses</Link>
    </section>
  );
};
