import { useEffect, useState } from "react";
import { fetchMyGrades, MyGrade } from "../api/gradeApi";
import { useAuth } from "../context/AuthContext";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const MyGradesPage: React.FC = () => {
  const { role } = useAuth();
  const isStudent = role === "Student";

  const [grades, setGrades] = useState<MyGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyGrades();
        setGrades(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load grades");
      } finally {
        setLoading(false);
      }
    };
    if (isStudent) {
      load();
    } else {
      setLoading(false);
    }
  }, [isStudent]);

  if (!isStudent) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        My grades is only available for students.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!grades.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        You don’t have any graded submissions yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My grades
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell align="right">Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((g, idx) => (
              <TableRow key={`${g.assignmentId}-${g.submittedAt}-${idx}`}>
                <TableCell>{g.courseTitle}</TableCell>
                <TableCell>{g.assignmentTitle}</TableCell>
                <TableCell>
                  {new Date(g.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {g.grade != null ? `${g.grade} / ${g.maxPoints}` : "Pending"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
