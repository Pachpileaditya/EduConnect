import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";
import AddContent from "./AddContent";
import UpdateContent from "./UpdateContent";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import ViewContent from "../comman/ViewContent";
import axios from "axios";

const TeacherContent = () => {
  const location = useLocation();
  const { subjectId } = location.state || {}; // Extract props

  const [openAddContent, setOpenAddContent] = useState(false);
  const [openViewContent, setOpenViewContent] = useState(false);
  const [openUpdateContent, setOpenUpdateContent] = useState(false);
  const [subjectContent, setSubjectContent] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null); // Store selected unit details
  const [teacherId, setTeacherId] = useState(null);
  const [token, setToken] = useState("")

  useEffect(() => {
    const teachId = localStorage.getItem("id")
    const tok = localStorage.getItem("token")

    if(teachId && tok)
    {
      setTeacherId(teachId)
      setToken(tok)
      
    }

    if (teacherId && subjectId) {
      getSubjectContent();
    }
  }, [teacherId, subjectId, token]);

  const getSubjectContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/content/${teacherId}/${subjectId}`
      );
      setSubjectContent(response.data);
    } catch (error) {
      console.error("Error fetching content:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to fetch content");
    }
  };

  const handleDelete = async (unitId) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
  
    try {
      await axios.delete(
        `http://localhost:8080/api/teachers/delete/${teacherId}/${subjectId}/${unitId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token here
          },
        }
      );
      alert("Unit deleted successfully");
      getSubjectContent(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting content:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to delete content");
    }
  };
  

  return (
    <>
      <Navbar />
      <hr />
      <div className="d-flex">
        <Sidebar />
        <div className="p-3 w-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Content</h3>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddContent(true)}
            >
              Add Content
            </Button>
          </div>
          <hr />

          {subjectContent.length > 0 ? (
            subjectContent.map(({ id, title, description, url }, index) => (
              <div className="card mb-3" key={id || index}>
                <div className="card-body">
                  <h5 className="card-title">Unit {id}: {title?.trim() || "No Title"}</h5>
                  <p className="card-text">{description?.trim() || "No Description Available"}</p>
                </div>

                <div className="card-footer text-end">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => {
                      setSelectedUnit({ id, title, description, url, unitNumber: index + 1 });
                      setOpenViewContent(true);
                    }}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-warning me-2"
                    onClick={() => {
                      setSelectedUnit({ id, title, description, url });
                      setOpenUpdateContent(true);
                    }}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No content available.</p>
          )}

          {/* Add Content Dialog */}
          <Dialog open={openAddContent} onClose={() => setOpenAddContent(false)} fullWidth maxWidth="sm">
            <DialogTitle>Add Content</DialogTitle>
            <DialogContent>
              <AddContent 
                subjectId={subjectId} 
                onClose={() => {
                  setOpenAddContent(false);
                  getSubjectContent(); // Refresh after adding content
                }} 
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddContent(false)} color="secondary">Cancel</Button>
            </DialogActions>
          </Dialog>

          {/* View Content Dialog */}
          <Dialog open={openViewContent} onClose={() => setOpenViewContent(false)} fullWidth maxWidth="sm">
            <DialogTitle>View Content</DialogTitle>
            <DialogContent>
              {selectedUnit ? <ViewContent unit={selectedUnit} /> : <p>Loading...</p>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewContent(false)} color="secondary">Close</Button>
            </DialogActions>
          </Dialog>

          {/* Update Content Dialog */}
          <Dialog open={openUpdateContent} onClose={() => setOpenUpdateContent(false)} fullWidth maxWidth="sm">
            <DialogTitle>Update Content</DialogTitle>
            <DialogContent>
              {selectedUnit ? (
                <UpdateContent
                  teacherId={teacherId}
                  subjectId={subjectId}
                  unit={selectedUnit}
                  onClose={() => {
                    setOpenUpdateContent(false);
                    getSubjectContent(); // Refresh after updating content
                  }}
                />
              ) : (
                <p>Loading...</p>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </>
  );
};

export default TeacherContent;
