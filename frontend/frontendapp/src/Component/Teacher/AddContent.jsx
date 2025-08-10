import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const AddContent = ({ subjectId, onClose }) => {
  const [unit, setUnit] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [token, setToken] = useState("")


  useEffect(() => {
    const tok = localStorage.getItem("token");
    const techId = localStorage.getItem("id");

    if(techId && tok)
    {
      setTeacherId(techId)
      setToken(tok)
    }
  }, [teacherId, token]);

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleAddContent = async () => {
    if (!unit || !title.trim() || !description.trim() || (!file && !url.trim())) {
      alert("Please fill in all fields and provide either a PDF file or a URL.");
      return;
    }
    setLoading(true);
    try {
      let formData;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (file) {
        formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        formData = {
          title,
          description,
          url: url.trim(),
        };
        config.headers['Content-Type'] = 'application/json';
      }
      await axios.post(
        `http://localhost:8080/api/teachers/add/${teacherId}/${subjectId}/${unit}`,
        formData,
        config
      );
      alert("Content added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding content:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to add content");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box p={3} className="position-relative" sx={{ fontFamily: 'Poppins, Arial, sans-serif', background: 'inherit', color: 'inherit', minHeight: '100vh' }}>
      <hr />
      {/* Unit Selection */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="unit-select-label">Select Unit</InputLabel>
        <Select
          labelId="unit-select-label"
          id="unit-select"
          value={unit}
          onChange={handleUnitChange}
          className="neon-input"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <MenuItem key={num} value={num}>
              Unit {num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Input Fields */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="neon-input"
            InputLabelProps={{ style: { color: '#222' } }}
            inputProps={{ style: { color: '#222', fontFamily: 'Poppins, Arial, sans-serif' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neon-input"
            InputLabelProps={{ style: { color: '#222' } }}
            inputProps={{ style: { color: '#222', fontFamily: 'Poppins, Arial, sans-serif' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            className="neon-btn"
            style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}
          >
            {file ? file.name : "Upload PDF File"}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={e => setFile(e.target.files[0])}
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Or Paste PDF/Content URL"
            variant="outlined"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="neon-input"
            InputLabelProps={{ style: { color: '#222' } }}
            inputProps={{ style: { color: '#222', fontFamily: 'Poppins, Arial, sans-serif' } }}
          />
        </Grid>
      </Grid>
      {/* Buttons */}
      <Box mt={3} textAlign="center">
        <Button
          variant="contained"
          className="neon-btn"
          style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}
          onClick={handleAddContent}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddContent;
