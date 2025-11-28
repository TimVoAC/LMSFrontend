import React, { useEffect, useState } from "react";
import { Course, fetchCourses } from "../../api/courseApi";

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!courses.length) return <p>No courses available.</p>;

  return (
    <div className="course-list">
      {courses.map((c) => (
        <div key={c.id} className="course-list__item">
          <div className="card">
            <h3>{c.title}</h3>
            <p className="course-card__instructor">Instructor: {c.instructorName}</p>
            {c.description && <p className="course-card__description">{c.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
