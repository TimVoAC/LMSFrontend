// src/pages/CourseDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchCourseDetail,
  CourseDetail,
  createLesson,
  createAssignment,
} from "../api/courseApi";
import {
  submitAssignment,
  fetchSubmissions,
  gradeSubmission,
  AssignmentSubmission,
} from "../api/assignmentApi";
import {
  fetchCourseGradebook,
  CourseGradebookEntry,
} from "../api/gradeApi";
import { useAuth } from "../context/AuthContext";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { Editor } from "@tinymce/tinymce-react";

const tinymceLessonConfig = {
  height: 260,
  menubar: false,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "charmap",
    "preview",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "table",
  ],
  toolbar:
    "undo redo | blocks | bold italic underline | " +
    "alignleft aligncenter alignright | bullist numlist | link table | code",
};

const tinymceAssignmentConfig = {
  height: 260,
  menubar: false,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "charmap",
    "preview",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
  ],
  toolbar:
    "undo redo | blocks | bold italic underline | " +
    "bullist numlist | alignleft aligncenter alignright | link | code",
};

type StudentSummary = {
  studentId: number;
  studentUsername: string;
  totalEarned: number;
  totalMax: number;
  percent: number | null;
};

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const isInstructor = role === "Instructor" || role === "Admin";
  const isStudent = role === "Student";

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Instructor: lesson + assignment creation
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");
  const [assignmentMaxPoints, setAssignmentMaxPoints] = useState(100);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Student: submit assignment dialog
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(
    null
  );
  const [submissionContent, setSubmissionContent] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Instructor: view & grade submissions per assignment
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
  const [submissionsAssignmentTitle, setSubmissionsAssignmentTitle] =
    useState("");
  const [submissionsAssignmentId, setSubmissionsAssignmentId] = useState<
    number | null
  >(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [gradeEdits, setGradeEdits] = useState<Record<number, string>>({});
  const [gradeSavingId, setGradeSavingId] = useState<number | null>(null);

  // Instructor: course gradebook
  const [gradebookOpen, setGradebookOpen] = useState(false);
  const [gradebookLoading, setGradebookLoading] = useState(false);
  const [gradebookError, setGradebookError] = useState<string | null>(null);
  const [gradebookEntries, setGradebookEntries] = useState<
    CourseGradebookEntry[]
  >([]);
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");
  const [studentFilter, setStudentFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const courseId = Number(id);
        const data = await fetchCourseDetail(courseId);
        setCourse(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reloadKey]);

  const refresh = () => setReloadKey((k) => k + 1);

  const handleCreateLesson = async () => {
    if (!id || !lessonTitle.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await createLesson(Number(id), {
        title: lessonTitle,
        content: lessonContent,
      });
      setLessonTitle("");
      setLessonContent("");
      refresh();
    } catch (err: any) {
      setSaveError(err?.message ?? "Failed to create lesson");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!id || !assignmentTitle.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await createAssignment(Number(id), {
        title: assignmentTitle,
        description: assignmentDescription,
        dueDate: assignmentDue || undefined,
        maxPoints: assignmentMaxPoints,
      });
      setAssignmentTitle("");
      setAssignmentDescription("");
      setAssignmentDue("");
      setAssignmentMaxPoints(100);
      refresh();
    } catch (err: any) {
      setSaveError(err?.message ?? "Failed to create assignment");
    } finally {
      setSaving(false);
    }
  };

  const openSubmitDialog = (assignmentId: number) => {
    setActiveAssignmentId(assignmentId);
    setSubmissionContent("");
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitDialogOpen(true);
  };

  const handleSubmitAssignment = async () => {
    if (!activeAssignmentId) return;
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await submitAssignment(activeAssignmentId, {
        content: submissionContent,
      });
      setSubmitSuccess("Submission received.");
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to submit assignment");
    } finally {
      setSubmitLoading(false);
    }
  };

  const openSubmissionsDialog = async (assignmentId: number, title: string) => {
    setSubmissionsAssignmentId(assignmentId);
    setSubmissionsAssignmentTitle(title);
    setSubmissions([]);
    setGradeEdits({});
    setSubmissionsError(null);
    setSubmissionsDialogOpen(true);
    setSubmissionsLoading(true);

    try {
      const data = await fetchSubmissions(assignmentId);
      setSubmissions(data);
    } catch (err: any) {
      setSubmissionsError(err?.message ?? "Failed to load submissions");
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleGradeChange = (submissionId: number, value: string) => {
    setGradeEdits((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleSaveGrade = async (submissionId: number) => {
    if (!submissionsAssignmentId) return;
    const raw = gradeEdits[submissionId];
    const grade = parseInt(raw, 10);
    if (Number.isNaN(grade)) return;

    setGradeSavingId(submissionId);
    setSubmissionsError(null);
    try {
      await gradeSubmission(submissionsAssignmentId, submissionId, grade);
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, grade } : s
        )
      );
    } catch (err: any) {
      setSubmissionsError(err?.message ?? "Failed to save grade");
    } finally {
      setGradeSavingId(null);
    }
  };

  const openGradebook = async () => {
    if (!course) return;
    setGradebookOpen(true);
    setGradebookLoading(true);
    setGradebookError(null);
    try {
      const data = await fetchCourseGradebook(course.id);
      setGradebookEntries(data);
    } catch (err: any) {
      setGradebookError(err?.message ?? "Failed to load gradebook");
    } finally {
      setGradebookLoading(false);
    }
  };

  const getFilteredEntries = () => {
    return gradebookEntries.filter((e) => {
      const byAssignment =
        assignmentFilter === "all" ||
        e.assignmentId === Number(assignmentFilter);

      const byStudent =
        studentFilter === "all" || e.studentId === Number(studentFilter);

      return byAssignment && byStudent;
    });
  };

  const getStudentSummaries = (): StudentSummary[] => {
    const filtered = getFilteredEntries();
    const map = new Map<number, StudentSummary>();

    for (const e of filtered) {
      if (e.grade == null) continue; // only graded

      let entry = map.get(e.studentId);
      if (!entry) {
        entry = {
          studentId: e.studentId,
          studentUsername: e.studentUsername,
          totalEarned: 0,
          totalMax: 0,
          percent: null,
        };
        map.set(e.studentId, entry);
      }

      entry.totalEarned += e.grade;
      entry.totalMax += e.maxPoints;
    }

    for (const entry of map.values()) {
      if (entry.totalMax > 0) {
        entry.percent =
          Math.round((entry.totalEarned / entry.totalMax) * 1000) / 10;
      } else {
        entry.percent = null;
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.studentUsername.localeCompare(b.studentUsername)
    );
  };

  const handleExportCsv = () => {
    if (!course) return;
    const filtered = getFilteredEntries();
    if (!filtered.length) return;

    const header = ["Student", "Assignment", "SubmittedAt", "Grade", "MaxPoints"];
    const rows = filtered.map((e) => [
      `"${e.studentUsername.replace(/"/g, '""')}"`,
      `"${e.assignmentTitle.replace(/"/g, '""')}"`,
      `"${new Date(e.submittedAt).toISOString()}"`,
      e.grade != null ? e.grade.toString() : "",
      e.maxPoints.toString(),
    ]);

    const csv =
      header.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `gradebook_course_${course.id}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  if (!course) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Course not found.
      </Alert>
    );
  }

  return (
    <Box>
      <Button
        component={Link}
        to="/courses"
        variant="text"
        size="small"
        sx={{ mb: 2 }}
      >
        ← Back to courses
      </Button>

      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Instructor: {course.instructorName}
      </Typography>

      {course.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {course.description}
        </Typography>
      )}

      {/* Instructor: manage content (lessons + assignments + gradebook) */}
      {isInstructor && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Manage content
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" onClick={openGradebook}>
              View gradebook
            </Button>
          </Box>

          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}

          {/* Add lesson */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add lesson
            </Typography>
            <TextField
              label="Title"
              size="small"
              fullWidth
              sx={{ mb: 1 }}
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Lesson content
            </Typography>
            <Editor
              apiKey="4lhtkz62mejwqpzqnz4s2vhcxq8xvr2hhc5wy2lvvlr68tmh"
              value={lessonContent}
              init={tinymceLessonConfig}
              onEditorChange={(content) => setLessonContent(content)}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleCreateLesson}
                disabled={saving || !lessonTitle.trim()}
              >
                {saving ? "Saving..." : "Save lesson"}
              </Button>
            </Box>
          </Paper>

          {/* Add assignment */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add assignment
            </Typography>
            <TextField
              label="Title"
              size="small"
              fullWidth
              sx={{ mb: 1 }}
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Assignment instructions
            </Typography>
            <Editor
              apiKey="4lhtkz62mejwqpzqnz4s2vhcxq8xvr2hhc5wy2lvvlr68tmh"
              value={assignmentDescription}
              init={tinymceAssignmentConfig}
              onEditorChange={(content) => setAssignmentDescription(content)}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 1 }}>
              <TextField
                label="Due date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={assignmentDue}
                onChange={(e) => setAssignmentDue(e.target.value)}
              />
              <TextField
                label="Max points"
                type="number"
                size="small"
                value={assignmentMaxPoints}
                onChange={(e) =>
                  setAssignmentMaxPoints(parseInt(e.target.value) || 0)
                }
              />
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleCreateAssignment}
              disabled={saving || !assignmentTitle.trim()}
            >
              {saving ? "Saving..." : "Save assignment"}
            </Button>
          </Paper>
        </Box>
      )}

      {/* Lessons */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lessons
        </Typography>
        {course.lessons.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No lessons yet.
          </Typography>
        ) : (
          <Paper>
            <List>
                {course.lessons.map((l) => (
                    <Box key={l.id}>
                    <ListItem alignItems="flex-start">
                        <Box sx={{ width: "100%" }}>
                        <Typography variant="subtitle1">{l.title}</Typography>
                        {l.content && (
                            <Box
                            sx={{
                                mt: 0.5,
                                "& p": { mb: 0.5 },
                                "& ul": { pl: 3 },
                                "& ol": { pl: 3 },
                            }}
                            dangerouslySetInnerHTML={{ __html: l.content }}
                            />
                        )}
                        </Box>
                    </ListItem>
                    <Divider />
                    </Box>
                ))}
                </List>
          </Paper>
        )}
      </Box>

      {/* Assignments */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Assignments
        </Typography>
        {course.assignments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No assignments yet.
          </Typography>
        ) : (
          <Paper>
            <List>
              {course.assignments.map((a) => (
                <Box key={a.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                        <Stack direction="row" spacing={1}>
                        {isStudent && (
                            <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openSubmitDialog(a.id)}
                            >
                            Submit
                            </Button>
                        )}
                        {isInstructor && (
                            <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                                openSubmissionsDialog(a.id, a.title)
                            }
                            >
                            View submissions
                            </Button>
                        )}
                        </Stack>
                    }
                    >
                    <Box sx={{ pr: 2, width: "100%" }}>
                        <Typography variant="subtitle1">{a.title}</Typography>

                        {a.description && (
                        <Box
                            sx={{
                            mt: 0.5,
                            mb: 0.5,
                            "& p": { mb: 0.5 },
                            "& ul": { pl: 3 },
                            "& ol": { pl: 3 },
                            }}
                            dangerouslySetInnerHTML={{ __html: a.description }}
                        />
                        )}

                        {a.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                            Due: {new Date(a.dueDate).toLocaleString()}
                        </Typography>
                        )}
                    </Box>
                    </ListItem>

                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Student: submit assignment dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Submit assignment</DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {submitSuccess}
            </Alert>
          )}
          <TextField
            label="Your answer"
            multiline
            minRows={4}
            fullWidth
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Close</Button>
          <Button
            onClick={handleSubmitAssignment}
            variant="contained"
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Instructor: view & grade submissions */}
      <Dialog
        open={submissionsDialogOpen}
        onClose={() => setSubmissionsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Submissions – {submissionsAssignmentTitle}</DialogTitle>
        <DialogContent>
          {submissionsLoading ? (
            <Box mt={2}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {submissionsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submissionsError}
                </Alert>
              )}
              {submissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No submissions yet.
                </Typography>
              ) : (
                <List>
                    {submissions.map((s) => (
                        <Box key={s.id}>
                        <ListItem alignItems="flex-start">
                            <Box sx={{ width: "100%" }}>
                            <Typography variant="subtitle2">
                                {s.studentUsername} —{" "}
                                {new Date(s.submittedAt).toLocaleString()}
                            </Typography>

                            {s.content && (
                                <Box
                                sx={{
                                    whiteSpace: "normal",
                                    mt: 0.5,
                                    "& p": { mb: 0.5 },
                                }}
                                dangerouslySetInnerHTML={{ __html: s.content }}
                                />
                            )}
                            </Box>
                        </ListItem>

                        <Box
                            sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            pb: 1,
                            }}
                        >
                            <TextField
                            label="Grade"
                            size="small"
                            type="number"
                            sx={{ width: 100 }}
                            value={
                                gradeEdits[s.id] ?? (s.grade != null ? String(s.grade) : "")
                            }
                            onChange={(e) => handleGradeChange(s.id, e.target.value)}
                            />
                            <Typography variant="body2" color="text.secondary">
                            Current: {s.grade != null ? s.grade : "Not graded"}
                            </Typography>
                            <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSaveGrade(s.id)}
                            disabled={gradeSavingId === s.id}
                            >
                            {gradeSavingId === s.id ? "Saving..." : "Save grade"}
                            </Button>
                        </Box>
                        <Divider />
                        </Box>
                    ))}
                    </List>

              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Instructor: course gradebook with filters + aggregates */}
      <Dialog
        open={gradebookOpen}
        onClose={() => setGradebookOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Gradebook – {course.title}</DialogTitle>
        <DialogContent>
          {gradebookLoading ? (
            <Box mt={2}>
              <CircularProgress />
            </Box>
          ) : gradebookError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {gradebookError}
            </Alert>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  mt: 1,
                  mb: 2,
                }}
              >
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="assignment-filter-label">
                    Assignment
                  </InputLabel>
                  <Select
                    labelId="assignment-filter-label"
                    label="Assignment"
                    value={assignmentFilter}
                    onChange={(e) =>
                      setAssignmentFilter(e.target.value as string)
                    }
                  >
                    <MenuItem value="all">All assignments</MenuItem>
                    {Array.from(
                      new Map(
                        gradebookEntries.map((e) => [
                          e.assignmentId,
                          e.assignmentTitle,
                        ])
                      ).entries()
                    ).map(([assignmentId, title]) => (
                      <MenuItem
                        key={assignmentId}
                        value={String(assignmentId)}
                      >
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="student-filter-label">
                    Student
                  </InputLabel>
                  <Select
                    labelId="student-filter-label"
                    label="Student"
                    value={studentFilter}
                    onChange={(e) =>
                      setStudentFilter(e.target.value as string)
                    }
                  >
                    <MenuItem value="all">All students</MenuItem>
                    {Array.from(
                      new Map(
                        gradebookEntries.map((e) => [
                          e.studentId,
                          e.studentUsername,
                        ])
                      ).entries()
                    ).map(([studentId, name]) => (
                      <MenuItem key={studentId} value={String(studentId)}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleExportCsv}
                >
                  Export CSV
                </Button>
              </Box>

              {/* Student summary */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Student summary (graded items only)
              </Typography>
              {getStudentSummaries().length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No graded submissions yet for the current filters.
                </Typography>
              ) : (
                <Table size="small" sx={{ mb: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell align="right">Total points</TableCell>
                      <TableCell align="right">Max points</TableCell>
                      <TableCell align="right">% in course</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getStudentSummaries().map((s) => (
                      <TableRow key={s.studentId}>
                        <TableCell>{s.studentUsername}</TableCell>
                        <TableCell align="right">
                          {s.totalEarned.toFixed(1)}
                        </TableCell>
                        <TableCell align="right">
                          {s.totalMax.toFixed(1)}
                        </TableCell>
                        <TableCell align="right">
                          {s.percent != null
                            ? `${s.percent.toFixed(1)}%`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Detailed submissions */}
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                All submissions (current filters)
              </Typography>
              {getFilteredEntries().length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  No submissions for the current filters.
                </Typography>
              ) : (
                <Table size="small" sx={{ mt: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell align="right">Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredEntries().map((e, idx) => (
                      <TableRow
                        key={`${e.studentId}-${e.assignmentId}-${e.submittedAt}-${idx}`}
                      >
                        <TableCell>{e.studentUsername}</TableCell>
                        <TableCell>{e.assignmentTitle}</TableCell>
                        <TableCell>
                          {new Date(e.submittedAt).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {e.grade != null
                            ? `${e.grade} / ${e.maxPoints}`
                            : "Pending"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradebookOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
