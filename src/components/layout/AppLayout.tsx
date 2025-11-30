import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Header } from "./Header";
import { NavBar } from "./NavBar";

export const AppLayout: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <NavBar />
      <Container sx={{ mt: 3, mb: 3, flex: 1 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          borderTop: 1,
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="caption">
          © {new Date().getFullYear()} MiniLMS. For educational use.
        </Typography>
      </Box>
    </Box>
  );
};
