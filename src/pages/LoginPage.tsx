import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <LoginForm onSuccess={() => navigate("/courses")} />
    </section>
  );
};
