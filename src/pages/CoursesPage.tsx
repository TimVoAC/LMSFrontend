import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useAuth } from "../context/AuthContext";
import { CourseList } from "../components/courses/CourseList";
import { MyCoursesList } from "../components/courses/MyCoursesList";
import { CreateCourseForm } from "../components/courses/CreateCourseForm";

export const CoursesPage: React.FC = () => {
  const { role } = useAuth();
  const isInstructor = role === "Instructor" || role === "Admin";
  const isStudent = role === "Student";

  // when this changes, CourseList and MyCoursesList re-load
  const [reloadKey, setReloadKey] = useState(0);

  const handleCourseCreated = () => {
    setReloadKey((k) => k + 1);
  };

  const handleEnrolled = () => {
    setReloadKey((k) => k + 1);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>

      {isInstructor && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Manage courses
          </Typography>
          <CreateCourseForm onCreated={handleCourseCreated} />
        </Box>
      )}

      {isStudent && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            My courses
          </Typography>
          <MyCoursesList reloadKey={reloadKey} />
          <Divider sx={{ my: 3 }} />
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        All courses
      </Typography>
      <CourseList reloadKey={reloadKey} onEnrolled={handleEnrolled} />
    </Box>
  );
};
