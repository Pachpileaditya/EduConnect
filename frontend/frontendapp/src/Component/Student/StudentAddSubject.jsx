import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const StudentAddSubject = ({ years, onSubjectsAdded }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [token, setToken] = useState("")
  const [studentId, setStudentId] = useState(null);

  useEffect(() =>
  {

    const tok = localStorage.getItem("token")
    const techId = localStorage.getItem("id")

    if(techId && tok)
    {
      setStudentId(techId)
      setToken(tok)
    }

  }, [studentId, token]);


  useEffect(() => {
    if (selectedYear) {
      fetchSubjects(selectedYear);
    }
  }, [selectedYear]);

  const fetchSubjects = async (yearId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/subjects/${yearId}`);
      setSubjects(response.data || []);
    } catch (error) {
      console.error(`Error fetching subjects for year ${yearId}:`, error);
      setSubjects([]);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedSubjects([]); // Clear selected subjects when year changes
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleEnrollSubjects = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    const subjectsToSend = selectedSubjects.map((subjectId) => {
      const subject = subjects.find((sub) => sub.id === subjectId);
      return { id: subject.id, name: subject.name };
    });

    try {
      await axios.post(
        `http://localhost:8080/api/students/enroll/${studentId}`,
        subjectsToSend,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Subjects enrolled successfully!");
      setSelectedSubjects([]);
      onSubjectsAdded(); // Refresh the dashboard after enrollment
    } catch (error) {
      console.error("Error enrolling subjects:", error.response?.data || error.message);
      alert("Failed to enroll subjects. Please try again.");
    }
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.length > 0 ? (
            years.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Years Available</MenuItem>
          )}
        </Select>
      </FormControl>

      {selectedYear && (
        <Grid container spacing={2}>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <Grid item xs={12} sm={6} key={subject.id}>
                <Card>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSubjects.includes(subject.id)}
                          onChange={() => handleSubjectToggle(subject.id)}
                        />
                      }
                      label={subject.name}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
              No subjects available for the selected year.
            </Typography>
          )}
        </Grid>
      )}

      <Box mt={3} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          disabled={selectedSubjects.length === 0}
          onClick={handleEnrollSubjects}
        >
          Enroll
        </Button>
      </Box>
    </Box>
  );
};

export default StudentAddSubject;
