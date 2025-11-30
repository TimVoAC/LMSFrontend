import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const NavBar: React.FC = () => {
  const { role } = useAuth();
  const isStudent = role === "Student";

  const linkStyle = ({ isActive }: any) => ({
    color: isActive ? "primary.main" : "text.secondary",
    textTransform: "none",
  });

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        px: 2,
        py: 1,
        display: "flex",
        gap: 1,
      }}
    >
      <Button
        component={NavLink}
        to="/courses"
        size="small"
        sx={linkStyle as any}
      >
        Courses
      </Button>

      {isStudent && (
        <Button
          component={NavLink}
          to="/grades"
          size="small"
          sx={linkStyle as any}
        >
          My grades
        </Button>
      )}

      <Button
        component={NavLink}
        to="/login"
        size="small"
        sx={linkStyle as any}
      >
        Login
      </Button>
    </Box>
  );
};
