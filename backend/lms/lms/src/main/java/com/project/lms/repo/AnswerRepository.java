package com.project.lms.repo;


import com.project.lms.entity.Answer;
import com.project.lms.entity.Question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.project.lms.entity.Teacher;



@Repository
public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    // Add custom methods as needed
    List<Answer> findByQuestion(Question question);

    List<Answer> findByTeacherAndQuestion(Teacher teacher, Question question);
    
}

