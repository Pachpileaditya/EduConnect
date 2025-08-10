import React, { useState, useEffect } from "react";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Avatar,
  IconButton,
  Pagination,
  TextField,
  Select,
  MenuItem,
  Divider,
  Box,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { deepPurple, blue, green, orange } from "@mui/material/colors";

const StudentQuestion = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answerLikes, setAnswerLikes] = useState({});
  const [answerLiked, setAnswerLiked] = useState({});
  const questionsPerPage = 3;
  const { subjectId } = location.state || {};
  const [unit, setUnit] = useState("all");
  const [studentId, setStudentId] = useState(null);
  const [token, setToken] = useState("");
  const [subjectName, setSubjectName] = useState("")

  useEffect(() => {
    if (studentId && token && subjectId) {
      fetchQuestions();
      fetchSubjectName(); // <-- fetch subject name separately
    }
  }, [studentId, token, subjectId]);
  

  useEffect(() => {
    const tok = localStorage.getItem("token");
    const stdId = localStorage.getItem("id");

    if (stdId && tok) {
      setStudentId(stdId);
      setToken(tok);
    }
  }, []);

  const fetchSubjectName = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:8080/api/subjects/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjectName(resp.data.subjectName);
      console.log("Hello"+subjectName)
    } catch (error) {
      console.error("Error fetching subject name:", error);
    }
  };
  

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/students/questions/${studentId}/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedQuestions = response.data.map((q) => ({
        id: q.id,
        question: q.text,
        studentName: q.studentDTO.name,
        unitNumber: q.unitDTO.unitno,
        createdAt: new Date(q.createdAt).toLocaleString(),
      }));

      setQuestions(formattedQuestions);
      fetchAnswers(formattedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchAnswers = async (questions) => {
    const answerData = {};
    const likesData = {};
    const likedData = {};

    for (const q of questions) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/answer/${q.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.length > 0) {
          answerData[q.id] = await Promise.all(response.data.map(async (ans) => {
            // Fetch like status for each answer
            let liked = false;
            try {
              const likeResp = await axios.get(
                `http://localhost:8080/api/students/has-liked/${ans.answerId}/${studentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              liked = likeResp.data === true;
            } catch (e) {
              liked = false;
            }
            likesData[ans.answerId] = ans.answerTrackingDTO.likes;
            likedData[ans.answerId] = liked;
            return {
              id: ans.answerId,
              text: ans.text,
              teacherName: ans.teacherNameDTO.name,
              likes: ans.answerTrackingDTO.likes,
              views: ans.answerTrackingDTO.views,
              createdAt: new Date(ans.createdAt).toLocaleString(),
            };
          }));
        } else {
          answerData[q.id] = [];
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
        answerData[q.id] = [];
      }
    }

    setAnswers(answerData);
    setAnswerLikes(likesData);
    setAnswerLiked(likedData);
  };

  const toggleLikeAnswer = async (answerId) => {
    if (answerLiked[answerId]) return; // already liked, do nothing

    try {
      const newLiked = true; // only allow liking
      setAnswerLiked((prev) => ({ ...prev, [answerId]: newLiked }));
      setAnswerLikes((prev) => ({
        ...prev,
        [answerId]: prev[answerId] + 1,
      }));

      await axios.post(
        `http://localhost:8080/api/students/like-answer/${answerId}/${studentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error liking answer:", error);
      // Revert optimistic UI if error
      setAnswerLiked((prev) => ({ ...prev, [answerId]: false }));
      setAnswerLikes((prev) => ({
        ...prev,
        [answerId]: prev[answerId] - 1,
      }));
    }
  };
  

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewQuestion("");
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/students/question/${studentId}/${subjectId}/${unit}`,
        newQuestion.trim(),
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchQuestions();
      setOpen(false);
      setNewQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  const startIndex = (page - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;

  const filteredQuestions =
    unit === "all"
      ? questions
      : questions.filter((q) => q.unitNumber === parseInt(unit));
  const displayedQuestions = filteredQuestions.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      <hr />
      <div className="d-flex">
        <Sidebar />

        <Box sx={{ display: "flex", width: "100%" }}>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: "100%" }}
          >
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  {subjectName || "N/A"} Questions
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<QuestionAnswerIcon />}
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: deepPurple[500],
                    "&:hover": { backgroundColor: deepPurple[700] },
                  }}
                >
                  Ask Question
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Filter by Unit:
                </Typography>
                <Select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="all">All Units</MenuItem>
                  {[1, 2, 3, 4, 5, 6].map((u) => (
                    <MenuItem key={u} value={u}>
                      Unit {u}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Paper>

            {displayedQuestions.length === 0 ? (
              <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  No questions found. Be the first to ask one!
                </Typography>
              </Paper>
            ) : (
              displayedQuestions.map((q, index) => (
                <Card key={q.id} sx={{ mb: 3, boxShadow: 3 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: blue[500] }}>
                        {q.studentName.charAt(0)}
                      </Avatar>
                    }
                    title={`Q: ${q.question}`}
                    subheader={
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Chip
                          label={`Unit ${q.unitNumber}`}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Asked by {q.studentName}
                        </Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Answers:
                    </Typography>
                    {answers[q.id] && answers[q.id].length > 0 ? (
                      answers[q.id].map((ans, i) => (
                        <Box
                          key={ans.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderLeft: `3px solid ${green[500]}`,
                            backgroundColor: "rgba(0, 0, 0, 0.02)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography paragraph sx={{ mb: 1 }}>
                            {ans.text}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Answered by <strong>{ans.teacherName}</strong>{" "}
                                on {ans.createdAt}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                size="small"
                                onClick={() => toggleLikeAnswer(ans.id)}
                                color={answerLiked[ans.id] ? "primary" : "default"}
                              >
                                {answerLiked[ans.id] ? (
                                  <AiFillLike size={16} />
                                ) : (
                                  <AiOutlineLike size={16} />
                                )}
                              </IconButton>
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {answerLikes[ans.id] || ans.likes}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No answers yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredQuestions.length / questionsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
              <DialogTitle>Ask a New Question</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((u) => (
                      <MenuItem key={u} value={u}>
                        Unit {u}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="question"
                    label="Your Question"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleClose}
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={!newQuestion.trim()}
                  sx={{
                    backgroundColor: deepPurple[500],
                    "&:hover": { backgroundColor: deepPurple[700] },
                  }}
                >
                  Submit Question
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default StudentQuestion;