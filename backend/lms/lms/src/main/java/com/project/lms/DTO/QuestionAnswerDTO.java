package com.project.lms.DTO;

import com.project.lms.service.AnswerService;
import com.project.lms.service.QuestionService;

public class QuestionAnswerDTO 
{
   private QuestionDTO questionDTO;
   private AnswerDTO answerDTO;
   public QuestionAnswerDTO() {
   }
   public QuestionAnswerDTO(QuestionDTO questionDTO, AnswerDTO answerDTO) {
    this.questionDTO = questionDTO;
    this.answerDTO = answerDTO;
   }
   public QuestionDTO getQuestionDTO() {
    return questionDTO;
   }
   public void setQuestionDTO(QuestionDTO questionDTO) {
    this.questionDTO = questionDTO;
   }
   public AnswerDTO getAnswerDTO() {
    return answerDTO;
   }
   public void setAnswerDTO(AnswerDTO answerDTO) {
    this.answerDTO = answerDTO;
   }
    
}
