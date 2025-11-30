import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { isAuthenticated, username, role, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MiniLMS
        </Typography>
        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {username}{" "}
              <Typography component="span" variant="body2" color="text.secondary">
                ({role})
              </Typography>
            </Typography>
            <Button color="inherit" variant="outlined" size="small" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant="body2">Guest</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
