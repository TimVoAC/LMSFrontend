import { NavLink } from "react-router-dom";

export const NavBar: React.FC = () => {
  return (
    <nav className="app-nav">
      <NavLink to="/courses" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
        Courses
      </NavLink>
      <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
        Login
      </NavLink>
    </nav>
  );
};
