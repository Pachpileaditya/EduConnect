import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
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

const AddSubject = ({ years }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState(""); // Manage selected year
  const teacherYears = years || []; // Ensure years is always an array
  const [token, setToken] = useState("")
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() =>
  {

    const tok = localStorage.getItem("token")
    const techId = localStorage.getItem("id")

    if(techId && tok)
    {
      setTeacherId(techId)
      setToken(tok)
    }

  }, [teacherId, token]);

  const fetchSubjects = async (yearId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/subjects/year/${yearId}`);
      setSubjects(response.data || []); // Store fetched subjects
    } catch (error) {
      console.error(`Error fetching subjects for year ${yearId}:`, error);
      setSubjects([]); // Clear subjects on error
    }
  };

  const handleYearChange = (event) => {
    const yearId = event.target.value;
    setSelectedYear(yearId);
    fetchSubjects(yearId); // Fetch subjects when year changes
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleAddSubjects = async () => {
    if (selectedSubjects.length === 0) {
      console.warn("No subjects selected to add.");
      return;
    }
  
    // Convert selected subject IDs to SubjectNamesDTO format
    const subjectsToSend = selectedSubjects.map((subjectId) => {
      const subject = subjects.find((sub) => sub.id === subjectId);
      return {
        id: subject.id,
        name: subject.name,
      };
    });
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/teachers/add-subjects/${teacherId}`,
        subjectsToSend, // Sending an array of SubjectNamesDTO objects
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //  Add token here
          },
        }
      );
  
      console.log("Subjects added successfully:", response.data);
      alert("Subjects added successfully!");
      setSelectedSubjects([]); // Clear selection after successful addition
    } catch (error) {
      console.error(`Error adding subjects for teacher ${teacherId}:`, error.response?.data || error.message);
      alert("Failed to add subjects. Please try again.");
    }
  };
  
  

  return (
    <Box className="position-relative" sx={{ fontFamily: 'Poppins, Arial, sans-serif', background: 'inherit', color: 'inherit', minHeight: '100vh' }}>
      {/* Dropdown for Selecting Year */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className="neon-input"
        >
          {teacherYears.length > 0 ? (
            teacherYears.map((yearValue) => (
              <MenuItem key={yearValue.id} value={yearValue.id}>
                {`Year ${yearValue.name || yearValue.id}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Years Available</MenuItem>
          )}
        </Select>
      </FormControl>
      {/* Subjects Listing */}
      {selectedYear && (
        <Grid container spacing={2}>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <Grid item xs={12} sm={6} key={subject.id}>
                <Card className="shadow-lg border-0" sx={{ background: '#fff', color: '#222', boxShadow: '0 0 12px #bb86fc44' }}>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSubjects.includes(subject.id)}
                          onChange={() => handleSubjectToggle(subject.id)}
                          sx={{ color: '#bb86fc' }}
                        />
                      }
                      label={<span style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>{subject.name}</span>}
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
      {/* Add Button */}
      <Box mt={3} textAlign="center">
        <Button
          variant="contained"
          className="neon-btn"
          style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}
          disabled={selectedSubjects.length === 0}
          onClick={handleAddSubjects}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddSubject;
