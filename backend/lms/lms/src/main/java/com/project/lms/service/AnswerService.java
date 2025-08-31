package com.project.lms.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.lms.entity.Answer;
import com.project.lms.entity.Question;
import com.project.lms.entity.Teacher;
import com.project.lms.repo.AnswerRepository;

import jakarta.transaction.Transactional;

@Service
public class AnswerService {

    private AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    };

    public Answer getAnswerById(int answerId) {
        return answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found with id = " + answerId));
    }

    @Transactional
    public Answer saveAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

    @Transactional
    public void deleteAnswer(Answer answer) {
        answerRepository.delete(answer);
    }

    public List<Answer> getAnswersByQuestion(Question question) {
        try {
            return answerRepository.findByQuestion(question);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching answers for question ID: " + question.getId(), e);
        }
    }

    public List<Answer> getAnswerByTeacherAndQuestion(Teacher teacher, Question question) {
        return answerRepository.findByTeacherAndQuestion(teacher, question);
    }

}
