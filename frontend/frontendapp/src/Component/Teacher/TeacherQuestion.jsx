import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Navbar from "../comman/Navbar"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  QuestionAnswer,
  CheckCircle,
  MoreVert,
  ThumbUp,
  Visibility,
  Person,
} from "@mui/icons-material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Sidebar from "../comman/Sidebar";

dayjs.extend(relativeTime);

const QuestionCard = ({
  question,
  teacherId,
  onAnswerSubmit,
  onAnswerUpdate,
  onAnswerDelete,
  index,
  totalCount,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Extract question and answer data from the DTO structure
  const questionData = question.questionDTO;
  const answerData = question.answerDTO;

  // Check if current teacher has answered this question
  const hasTeacherAnswered =
    answerData &&
    String(answerData.teacherNameDTO?.teacherId) === String(teacherId);

  const handleOpenDialog = (answer = null) => {
    if (answer) {
      setAnswerText(answer.text);
      setEditingAnswerId(answer.answerId);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnswerText("");
    setEditingAnswerId(null);
  };

  const handleSubmit = () => {
    if (editingAnswerId) {
      onAnswerUpdate(questionData.id, answerText, editingAnswerId);
    } else {
      onAnswerSubmit(questionData.id, answerText);
    }
    handleCloseDialog();
  };

  const handleMenuOpen = (event, answer) => {
    setAnchorEl(event.currentTarget);
    setSelectedAnswer(answer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAnswer(null);
  };

  const handleDelete = () => {
    onAnswerDelete(selectedAnswer.answerId);
    handleMenuClose();
  };

  // Helper function to parse question text (some are JSON strings)
  const parseQuestionText = (text) => {
    try {
      const parsed = JSON.parse(text);
      return parsed.text || text;
    } catch (e) {
      // Handle URL encoded strings
      try {
        return decodeURIComponent(text.replace(/\+/g, " "));
      } catch (e) {
        return text;
      }
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderLeft: `4px solid ${hasTeacherAnswered ? "#4caf50" : "#2196f3"}`,
        boxShadow: 3,
      }}
    >
      <CardContent>
        {/* Question Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Chip
                label={`Unit ${questionData.unitDTO.unitno}`}
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {dayjs(questionData.createdAt).fromNow()}
              </Typography>
              {hasTeacherAnswered && (
                <Chip
                  icon={<CheckCircle fontSize="small" />}
                  label="Answered"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Stack>

            <Typography variant="h6" gutterBottom>
              <span style={{ color: "#fff" }}>
                {index + 1}/{totalCount}.{" "}
              </span>
              {parseQuestionText(questionData.text)}
            </Typography>
          </Box>

          {/* Student Info */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32 }}>
              {questionData.studentDTO.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">
                {questionData.studentDTO.name}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Answers Section */}
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Answers{" "}
            <Badge
              badgeContent={answerData ? 1 : 0}
              color="primary"
              sx={{ ml: 1 }}
            />
          </Typography>

          {answerData ? (
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                backgroundColor: hasTeacherAnswered
                  ? "rgba(76, 175, 80, 0.08)"
                  : "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 28, height: 28 }}>
                    {answerData.teacherNameDTO?.name?.charAt(0) || "T"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {answerData.teacherNameDTO?.name || "Unknown Teacher"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(answerData.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Stack>

                {hasTeacherAnswered && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, answerData)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Typography variant="body1" mt={1.5} whiteSpace="pre-wrap">
                {answerData.text}
              </Typography>

              <Stack direction="row" spacing={2} mt={1.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  <ThumbUp
                    fontSize="inherit"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  {answerData.answerTrackingDTO?.likes || 0} Likes
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <Visibility
                    fontSize="inherit"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  {answerData.answerTrackingDTO?.views || 0} Views
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" py={2}>
              No answers yet
            </Typography>
          )}
        </Box>

        {/* Answer Button */}
        {!answerData && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              startIcon={<QuestionAnswer />}
              onClick={() => handleOpenDialog()}
            >
              Answer Question
            </Button>
          </Box>
        )}
      </CardContent>

      {/* Answer Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {editingAnswerId ? <Edit /> : <QuestionAnswer />}
            <Typography variant="h6">
              {editingAnswerId ? "Update Answer" : "Answer Question"}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Question:
            </Typography>
            <Typography variant="body1" paragraph>
              {parseQuestionText(questionData.text)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                Asked by {questionData.studentDTO.name}
              </Typography>
              <Chip
                label={`Unit ${questionData.unitDTO.unitno}`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            label="Your answer"
            variant="outlined"
            placeholder="Write your detailed answer here..."
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!answerText.trim()}
            startIcon={editingAnswerId ? <Edit /> : <QuestionAnswer />}
          >
            {editingAnswerId ? "Update Answer" : "Submit Answer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Answer Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleOpenDialog(selectedAnswer);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit Answer
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          Delete Answer
        </MenuItem>
      </Menu>
    </Card>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    questionDTO: PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      studentDTO: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      unitDTO: PropTypes.shape({
        unitno: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    answerDTO: PropTypes.shape({
      answerId: PropTypes.number,
      text: PropTypes.string,
      createdAt: PropTypes.string,
      teacherNameDTO: PropTypes.shape({
        name: PropTypes.string,
        teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      answerTrackingDTO: PropTypes.shape({
        likes: PropTypes.number,
        views: PropTypes.number,
      }),
    }),
  }).isRequired,
  teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onAnswerSubmit: PropTypes.func.isRequired,
  onAnswerUpdate: PropTypes.func.isRequired,
  onAnswerDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

const TeacherQuestion = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [unitFilter, setUnitFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const teacherId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const questionsPerPage = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/teachers/question/${subjectId}/${teacherId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId && token && subjectId) {
      fetchQuestions();
    }
  }, [subjectId, teacherId, token]);

  const filteredQuestions = questions.filter((q) => {
    // Filter by unit number if unitFilter is not 'all'
    const isUnitMatch =
      unitFilter === "all" ||
      q.questionDTO.unitDTO.unitno === parseInt(unitFilter);

    // Check if the question has an answer
    const hasAnswer = q.answerDTO !== null;

    // Check if the answer is from the current teacher
    const isTeacherAnswer =
      hasAnswer &&
      String(q.answerDTO.teacherNameDTO?.teacherId) === String(teacherId);

    // Apply status filter
    const isStatusMatch =
      statusFilter === "all" ||
      (statusFilter === "answered" && hasAnswer) ||
      (statusFilter === "unanswered" && !hasAnswer);

    // Return true if both unit and status filters match
    return isUnitMatch && isStatusMatch;
  });

  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * questionsPerPage,
    page * questionsPerPage
  );

  const handleAnswerSubmit = async (questionId, answerText) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/teachers/answer/${teacherId}/${questionId}`,
        { answerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(
        questions.map((q) =>
          q.questionDTO.id === questionId ? { ...q, answerDTO: res.data } : q
        )
      );
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
    }
  };

  const handleAnswerUpdate = async (questionId, answerText, answerId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/teachers/update-answer/${answerId}`,
        { answerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(
        questions.map((q) =>
          q.questionDTO.id === questionId
            ? {
                ...q,
                answerDTO: {
                  ...q.answerDTO,
                  text: answerText,
                },
              }
            : q
        )
      );
    } catch (err) {
      console.error("Error updating answer:", err);
      setError("Failed to update answer. Please try again.");
    }
  };

  const handleAnswerDelete = async (answerId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/teachers/delete-answer/${answerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(
        questions.map((q) =>
          q.answerDTO?.answerId === answerId ? { ...q, answerDTO: null } : q
        )
      );
    } catch (err) {
      console.error("Error deleting answer:", err);
      setError("Failed to delete answer. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Navbar />
      <hr />
      <div className="d-flex">
        {/* Sidebar with fixed width */}
        <div style={{ width: '240px' }}>
          <Sidebar />
        </div>
  
        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>
  
          {/* Filters */}
          <Box
            display="flex"
            justifyContent="space-between"
            mb={3}
            alignItems="center"
          >
            <Typography variant="h4">Student Questions</Typography>
  
            <Stack direction="row" spacing={2} alignItems="center">
              <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={(e, newFilter) => {
                  if (newFilter !== null) {
                    setStatusFilter(newFilter);
                    setPage(1);
                  }
                }}
                size="small"
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="answered">
                  <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                  Answered
                </ToggleButton>
                <ToggleButton value="unanswered">
                  <QuestionAnswer fontSize="small" sx={{ mr: 0.5 }} />
                  Unanswered
                </ToggleButton>
              </ToggleButtonGroup>
  
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={unitFilter}
                  onChange={(e) => {
                    setUnitFilter(e.target.value);
                    setPage(1);
                  }}
                  label="Unit"
                >
                  <MenuItem value="all">All Units</MenuItem>
                  {[1, 2, 3, 4, 5, 6].map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      Unit {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
  
          {/* Questions List */}
          {paginatedQuestions.length > 0 ? (
            <>
              {paginatedQuestions.map((question, index) => (
                <QuestionCard
                  key={question.questionDTO.id}
                  question={question}
                  teacherId={teacherId}
                  onAnswerSubmit={handleAnswerSubmit}
                  onAnswerUpdate={handleAnswerUpdate}
                  onAnswerDelete={handleAnswerDelete}
                  index={index}
                  totalCount={filteredQuestions.length}
                />
              ))}
  
              {/* Pagination */}
              {filteredQuestions.length > questionsPerPage && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={Math.ceil(
                      filteredQuestions.length / questionsPerPage
                    )}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                {statusFilter === "answered"
                  ? "You haven't answered any questions yet"
                  : statusFilter === "unanswered"
                  ? "No unanswered questions"
                  : "No questions found"}
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
  
};

export default TeacherQuestion;
