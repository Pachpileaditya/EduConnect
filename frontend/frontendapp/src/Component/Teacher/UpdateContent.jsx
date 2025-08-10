import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const UpdateContent = ({ unit, subjectId, onClose }) => {
  const [title, setTitle] = useState(unit?.title || "");
  const [description, setDescription] = useState(unit?.description || "");
  const [fileURL, setFileURL] = useState(unit?.url || "");
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [token, setToken] = useState("")
  

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

    const handleUpdate = async () => {
      if (!title.trim() || !description.trim() || !fileURL.trim()) {
        alert("Please fill in all fields.");
        return;
      }
    
      setLoading(true);
      try {
        await axios.put(
          `http://localhost:8080/api/teachers/update/${teacherId}/${subjectId}/${unit.id}`,
          { title, description, fileURL },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token here
            },
          }
        );
    
        alert("Content updated successfully");
        onClose(); // Close the update dialog after success
      } catch (error) {
        console.error("Error updating content:", error.response?.data || error.message);
        alert(error.response?.data?.error || "Failed to update content");
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <div className="p-3">
      <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" />
      <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" multiline rows={3} />
      <TextField fullWidth label="File URL" value={fileURL} onChange={(e) => setFileURL(e.target.value)} margin="normal" />
      
      <div className="mt-3 text-end">
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleUpdate} color="primary" variant="contained" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateContent;
