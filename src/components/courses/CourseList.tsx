// src/components/courses/CourseList.tsx
import { useEffect, useState } from "react";
import { Course, fetchCourses } from "../../api/courseApi";
import {
  fetchMyCourses,
  enrollInCourse,
  MyCourse,
} from "../../api/enrollmentApi";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CardActionArea from "@mui/material/CardActionArea";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type CourseStatus = "NotEnrolled" | "InProgress" | "Closed";

interface CourseWithStatus extends Course {
  status: CourseStatus;
}

interface CourseListProps {
  reloadKey: number;
  onEnrolled?: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({ reloadKey, onEnrolled }) => {
  const { role } = useAuth();
  const isStudent = role === "Student";

  const [courses, setCourses] = useState<CourseWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const allCourses = await fetchCourses();

        if (isStudent) {
          const myCourses: MyCourse[] = await fetchMyCourses();
          const myIds = new Set(myCourses.map((c) => c.courseId));

          const withStatus: CourseWithStatus[] = allCourses.map((c) => ({
            ...c,
            status: myIds.has(c.id) ? "InProgress" : "NotEnrolled",
          }));
          setCourses(withStatus);
        } else {
          const withStatus: CourseWithStatus[] = allCourses.map((c) => ({
            ...c,
            status: "InProgress", // treat as open for now
          }));
          setCourses(withStatus);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reloadKey, isStudent]);

  const getStatusChip = (status: CourseStatus) => {
    switch (status) {
      case "NotEnrolled":
        return <Chip label="Not enrolled" size="small" />;
      case "InProgress":
        return <Chip label="In progress" color="success" size="small" />;
      case "Closed":
        return <Chip label="Closed" color="error" size="small" />;
      default:
        return null;
    }
  };

  const handleEnroll = async (courseId: number) => {
    setEnrollError(null);
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, status: "InProgress" } : c
        )
      );
      onEnrolled?.();
    } catch (err: any) {
      setEnrollError(err?.message ?? "Failed to enroll in course");
    } finally {
      setEnrollingId(null);
    }
  };

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
    return <Typography>No courses available.</Typography>;
  }

  return (
    <Box>
      {enrollError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {enrollError}
        </Alert>
      )}
      <Grid container spacing={2}>
        {courses.map((c) => (
          <Grid item xs={12} md={6} key={c.id}>
            <Card variant="outlined">
              {/* 👇 Card is now clickable: goes to /courses/:id for all roles */}
              <CardActionArea component={RouterLink} to={`/courses/${c.id}`}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">{c.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {c.instructorName}
                    </Typography>
                    {c.description && (
                      <Typography variant="body2">{c.description}</Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mt: 1 }}
                    >
                      {getStatusChip(c.status)}

                      {/* Student-only Enroll button for NotEnrolled */}
                      {isStudent && c.status === "NotEnrolled" && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(e) => {
                            e.preventDefault();  // 👈 prevents navigation when clicking enroll
                            e.stopPropagation();
                            handleEnroll(c.id);
                          }}
                          disabled={enrollingId === c.id}
                        >
                          {enrollingId === c.id ? "Enrolling..." : "Enroll"}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
