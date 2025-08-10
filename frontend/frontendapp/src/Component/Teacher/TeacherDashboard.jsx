import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import AddSubject from "./AddSubject";
import axios from "axios";
import ChatWidget from '../ChatWidget';

const baseURL = "http://localhost:8080/api";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState(null);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjectsCache, setSubjectsCache] = useState({});
  const [token, setToken] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const id = localStorage.getItem("id");
  
    if (storedToken && id) {
      setToken(storedToken);
      setTeacherId(id);
    }
  }, []);
  
  // Fetch years when teacherId and token are available
  useEffect(() => {
    if (teacherId && token) {
      getYearsForTeacher();
    }
  }, [teacherId, token]);
  
  const getYearsForTeacher = async () => {
    try {
      const response = await axios.get(`${baseURL}/teachers/years/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = response.data;
      setYears(data);
  
      if (data.length > 0) {
        setSelectedYear(data[0].id);
        fetchSubjects(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
      alert("Failed to fetch years. Please try again later.");
    }
  };
  
  const fetchSubjects = async (yearId) => {
    if (subjectsCache[yearId]) {
      setSubjects(subjectsCache[yearId]);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.get(`${baseURL}/teachers/${teacherId}/${yearId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const fetchedSubjects = response.data || [];
      setSubjects(fetchedSubjects);
  
      setSubjectsCache((prevCache) => ({
        ...prevCache,
        [yearId]: fetchedSubjects,
      }));
    } catch (error) {
      console.error(`Error fetching subjects for year ${yearId}:`, error);
      alert("Failed to fetch subjects. Please try again later.");
      setSubjects([]);
    }
  
    setLoading(false);
  };
  
  const handleYearChange = (event, newValue) => {
    setSelectedYear(newValue);
    fetchSubjects(newValue);
  };
  
  const handleDeleteSubject = async (subject) => {
    if (!window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
      return;
    }
  
    try {
      await axios.delete(`${baseURL}/teachers/delete-subject/${teacherId}/${subject.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSubjects((prevSubjects) => prevSubjects.filter((s) => s.id !== subject.id));
      console.log(`Subject ${subject.name} deleted successfully`);
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again later.");
    }
  };
  
  if (!teacherId) {
    return <div>Loading...</div>;
  }
  

  return (
    <>
      <Navbar />
      <hr />
      <div className="d-flex">
        <Sidebar onOpenChat={() => setChatOpen(true)} />
        <div className="p-4 w-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Subjects</h2>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              Add Subject
            </button>
          </div>
          <hr />

          {years.length > 0 ? (
            <Tabs value={selectedYear} onChange={handleYearChange} aria-label="Year Selection">
              {years.map((year) => (
                <Tab key={year.id} label={year.year} value={year.id} />
              ))}
            </Tabs>
          ) : (
            <p>No years available</p>
          )}

          <Box mt={3}>
            {loading ? (
              <p>Loading subjects...</p>
            ) : subjects.length > 0 ? (
              subjects.map((subject) => (
                <div className="card mb-3" key={subject.id}>
                  <div className="card-body">
                    <h5 className="card-title">{subject.name}</h5>
                  </div>
                  <div className="card-footer text-end">
                    <button
                      className="btn btn-success me-2"
                      onClick={() =>
                        navigate(`/teacher/content/${subject.id}`, {
                          state: { subjectId: subject.id },
                        })
                      }
                    >
                      Content
                    </button>
                    <button
                      className="btn btn-info me-2"
                      onClick={() =>
                        navigate(`/teacher/queries/${teacherId}/${subject.id}`, {
                          state: { teacherId, subjectId: subject.id },
                        })
                      }
                    >
                      Queries
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteSubject(subject)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No subjects found for the selected year.</p>
            )}
          </Box>
        </div>
      </div>

      <ChatWidget user={{ name: localStorage.getItem('name') || 'Teacher', id: localStorage.getItem('id') }} open={chatOpen} setOpen={setChatOpen} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Subject</DialogTitle>
        <DialogContent>
          <AddSubject years={years} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeacherDashboard;