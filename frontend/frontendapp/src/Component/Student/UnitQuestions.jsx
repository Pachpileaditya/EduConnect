import React, { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";

const UnitQuestions = ({ unitId }) => {
  const [likes, setLikes] = useState(Array(6).fill(0));
  const [liked, setLiked] = useState(Array(6).fill(false));
  const [page, setPage] = useState(1);
  const questionsPerPage = 3;

  const navigate = useNavigate()

  const questions = [
    { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
    { question: "What is JSX?", answer: "JSX stands for JavaScript XML and allows us to write HTML in React." },
    { question: "What are React hooks?", answer: "Hooks let you use state and other React features without writing a class." },
    { question: "What is useState?", answer: "useState is a Hook that lets you add state to a functional component." },
    { question: "What is useEffect?", answer: "useEffect is a Hook that lets you perform side effects in function components." },
    { question: "What is React Router?", answer: "React Router is a library for routing in React applications." }
  ];

  const toggleLike = (index) => {
    setLiked(prevLiked => {
      const newLiked = [...prevLiked];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
    
    setLikes(prevLikes => {
      const newLikes = [...prevLikes];
      newLikes[index] = liked[index] ? newLikes[index] - 1 : newLikes[index] + 1;
      return newLikes;
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const displayedQuestions = questions.slice((page - 1) * questionsPerPage, page * questionsPerPage);

  return (
    <div>
      <Navbar />
      <hr />
      <div className="d-flex">
        <Sidebar />
        <div className="p-3 w-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>FAQ's</h4>
            <div>
              <button className="btn btn-secondary" onClick={()=>navigate('/student-own-question-answer')}>My Questions</button>
            </div>
          </div>
          <hr />

          <div className="container">
            {displayedQuestions.map((q, index) => (
              <div key={index} className="card mb-3 p-3 d-flex justify-content-between">
                <div>
                  <b>Question: </b> {q.question}
                  <br />
                  <b>Answer: </b> {q.answer}
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-sm btn-light me-2" onClick={() => toggleLike(index)}>
                    {liked[index] ? <AiFillLike size={16} color="blue" /> : <AiOutlineLike size={16} />}
                  </button>
                  <span>{likes[index]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Pagination count={Math.ceil(questions.length / questionsPerPage)} color="primary" page={page} onChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitQuestions;