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
  CircularProgress,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import ChatWidget from '../ChatWidget';

const baseURL = "http://localhost:8080/api";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [yearId, setYearId] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [token, setToken] = useState("")
  const [studentId, setStudentId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  
  useEffect(() => {
    const tok = localStorage.getItem("token");
    const stuId = localStorage.getItem("id");
    console.log(stuId);
  
    if (stuId && tok) {
      setStudentId(stuId);
      setToken(tok);
    }
  }, []); //  Only runs once on mount

  useEffect(() => {
    if (studentId && token) {
      fetchStudentYear();
    }
  }, [studentId, token]);
  

  const fetchStudentYear = async () => {
    try {
      const response = await axios.get(`${baseURL}/students/year/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setYearId(response.data.id);
        fetchStudentSubjects(response.data.id);
      }
    } catch (error) {
      console.error("Error fetching student year:", error);
      setLoading(false);
    }
  };

  const fetchStudentSubjects = async (yearId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/students/subjects/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSubjects(response.data || []);
      fetchAvailableSubjects(yearId);
    } catch (error) {
      console.error("Error fetching student subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSubjects = async (yearId) => {
    try {
      const response = await axios.get(`${baseURL}/subjects/year/${yearId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSubjects(response.data || []);
    } catch (error) {
      console.error("Error fetching available subjects:", error);
    }
  };
  const fetchTeachers = async (subjectId) => {
    try {
      const response = await axios.get(`${baseURL}/subjects/teacher/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers for subjectId =", subjectId);
    }
  };

  const handleToggleSubject = (subject) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.some((s) => s.subjectId === subject.id)
        ? prevSelected.filter((s) => s.subjectId !== subject.id)
        : [...prevSelected, { subjectId: subject.id, subjectName: subject.name }]
    );
  };

  const handleAddSubjects = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    try {
      await axios.post(`${baseURL}/students/subjects/add/${studentId}`, selectedSubjects, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedSubjects([]);
      setOpenSubjectDialog(false);
      fetchStudentSubjects(yearId);
    } catch (error) {
      console.error("Error adding subjects:", error);
    }
  };
  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to remove ${subjectName}?`)) return;
    try {
      await axios.delete(`${baseURL}/students/subject/${studentId}/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudentSubjects(yearId);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const handleViewContent = async (subject) => {
    setSelectedSubject(subject);
    await fetchTeachers(subject.id);
    setOpenTeacherDialog(true);
  };

  const handleSelectTeacher = (teacher) => {
    console.log(teacher);
    setOpenTeacherDialog(false);
    navigate(`/student/content/${teacher.teacherId}/${selectedSubject.id}`, {
      state: { subjectId: selectedSubject.id, teacherId: teacher.teacherId },
    });
  };
  

  const handleViewQueries = (subjectId) => {
    navigate(`/student/queries`, {
      state : {studentId: studentId, subjectId: subjectId}
    });
  };

  return (
    <>
      <Navbar />
      <hr />
      <div className="d-flex">
        <Sidebar onOpenChat={() => setChatOpen(true)} />
        <div className="p-4 w-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Your Subjects</h2>
            <button className="btn btn-primary" onClick={() => setOpenSubjectDialog(true)}>
              Add Subject
            </button>
          </div>
          <hr />

          {loading ? (
            <CircularProgress />
          ) : availableSubjects.length > 0 ? (
            availableSubjects.map((subject) => (
              <div className="card mb-3" key={subject.id}>
                <div className="card-body">
                  <h5 className="card-title">{subject.name || "Unknown Subject"}</h5>
                </div>
                <div className="card-footer text-end">
                  <button className="btn btn-success me-2" onClick={() => handleViewContent(subject)}>
                    View Content
                  </button>
                  <button className="btn btn-warning me-2" onClick={() => handleViewQueries(subject.id)}>
                    Queries
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteSubject(subject.id, subject.name)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No subjects found.</p>
          )}
        </div>
      </div>

      {/* Add Subject Dialog */}
      <Dialog open={openSubjectDialog} onClose={() => setOpenSubjectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add or Remove Subjects</DialogTitle>
        <DialogContent>
          {availableSubjects.length > 0 ? (
            availableSubjects.map((subject) => (
              <div key={subject.id} className="d-flex justify-content-between align-items-center my-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSubjects.some((s) => s.subjectId === subject.id)}
                      onChange={() => handleToggleSubject(subject)}
                    />
                  }
                  label={subject.name || "Unknown Subject"}
                />
              </div>
            ))
          ) : (
            <p>No subjects available to add.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubjectDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSubjects} color="primary" variant="contained">
            Add Selected
          </Button>
        </DialogActions>
      </Dialog>
      {/* View Teachers Dialog */}
      <Dialog open={openTeacherDialog} onClose={() => setOpenTeacherDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Teacher</DialogTitle>
        <DialogContent>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div key={teacher.id} className="d-flex justify-content-between align-items-center my-2">
                <Button onClick={() => handleSelectTeacher(teacher)}>{teacher.name}</Button>
              </div>
            ))
          ) : (
            <p>No teachers available.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeacherDialog(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ChatWidget user={{ name: localStorage.getItem('name') || 'Student', id: localStorage.getItem('id') }} open={chatOpen} setOpen={setChatOpen} />
    </>
  );
};

export default StudentDashboard;
