import { useEffect, useState } from "react";
import { fetchMyCourses, MyCourse } from "../../api/enrollmentApi";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import { Link as RouterLink } from "react-router-dom";

interface MyCoursesListProps {
  reloadKey: number;
}

export const MyCoursesList: React.FC<MyCoursesListProps> = ({ reloadKey }) => {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyCourses();
        setCourses(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load my courses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reloadKey]);

  if (loading) {
    return (
      <Box mt={1}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!courses.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        You are not enrolled in any courses yet.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {courses.map((c) => (
        <Grid item xs={12} md={6} key={c.courseId}>
          <Card variant="outlined">
            <CardActionArea
              component={RouterLink}
              to={`/courses/${c.courseId}`}
            >
              <CardContent>
                <Typography variant="subtitle1">{c.title}</Typography>
                {c.description && (
                  <Typography variant="body2" color="text.secondary">
                    {c.description}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
