import { Course } from "../../api/courseApi";

interface Props {
  course: Course;
}

export const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <div className="card course-card">
      <h3>{course.title}</h3>
      <p className="course-card__instructor">Instructor: {course.instructorName}</p>
      {course.description && <p className="course-card__description">{course.description}</p>}
    </div>
  );
};
