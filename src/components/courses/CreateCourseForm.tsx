// src/components/courses/CreateCourseForm.tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { createCourse } from "../../api/courseApi";

interface Props {
  onCreated?: () => void;
}

export const CreateCourseForm: React.FC<Props> = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createCourse({ title, description });
      setTitle("");
      setDescription("");
      onCreated?.(); // 👈 trigger parent to refresh list
    } catch (err: any) {
      setError(err?.message ?? "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexWrap="wrap"
      gap={2}
    >
      {error && (
        <Alert severity="error" sx={{ flexBasis: "100%" }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Course title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ minWidth: 220 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ flex: 1, minWidth: 260 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !title.trim()}
      >
        {loading ? "Creating..." : "Create course"}
      </Button>
    </Box>
  );
};
