import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { isAuthenticated, username, role, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-logo">MiniLMS</span>
      </div>
      <div className="app-header__right">
        {isAuthenticated ? (
          <>
            <span className="app-header__user">
              {username} <span className="app-header__role">({role})</span>
            </span>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <span className="app-header__guest">Guest</span>
        )}
      </div>
    </header>
  );
};
