import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { NavBar } from "./NavBar";

export const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <NavBar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        © {new Date().getFullYear()} MiniLMS. For educational use.
      </footer>
    </div>
  );
};
