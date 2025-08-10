import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";
import ViewContent from "../comman/ViewContent";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";

const StudentContent = () => {
  const location = useLocation();
  const { state } = location;
  const studentId = state?.studentId || 2; // Replace with actual student ID
  const subjectId = state?.subjectId;
  const teacherId = state?.teacherId;
  const [openViewContent, setOpenViewContent] = useState(false);
  const [subjectContent, setSubjectContent] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null); // Store selected unit details

  const getSubjectContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/content/${teacherId}/${subjectId}`
      );
      setSubjectContent(response.data);
    } catch (error) {
      console.error(
        "Error fetching content:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.error || "Failed to fetch content");
    }
  };
  useEffect(() => {
    if (studentId && subjectId) {
      getSubjectContent();
    }
  }, [studentId, subjectId]);

  return (
    <>
      <Navbar />
      <hr />
      <div className="d-flex">
        <Sidebar />
        <div className="p-3 w-100">
          <h3>Available Content</h3>
          <hr />

          {subjectContent.length > 0 ? (
            subjectContent.map((item, index) => {
              // Normalize the URL field for ViewContent
              const url = item.url || item.fileURL;
              return (
                <div className="card mb-3" key={item.id || index}>
                  <div className="card-body">
                    <h5 className="card-title">
                      Unit {item.id}: {item.title?.trim() || "No Title"}
                    </h5>
                    <p className="card-text">
                      {item.description?.trim() || "No Description Available"}
                    </p>
                  </div>

                  <div className="card-footer text-end">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setSelectedUnit({ ...item, url });
                        setOpenViewContent(true);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No content available.</p>
          )}

          {/* View Content Dialog */}
          <Dialog
            open={openViewContent}
            onClose={() => setOpenViewContent(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>View Content</DialogTitle>
            <DialogContent>
              {selectedUnit ? (
                <ViewContent unit={selectedUnit} />
              ) : (
                <p>Loading...</p>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenViewContent(false)}
                color="secondary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default StudentContent;
