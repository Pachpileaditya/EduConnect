package com.project.lms.repo;

import com.project.lms.entity.AnswerLike;
import com.project.lms.entity.Student;
import com.project.lms.entity.AnswerTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerLikeRepository extends JpaRepository<AnswerLike, Long> {
    boolean existsByStudentAndAnswerTracking(Student student, AnswerTracking answerTracking);
    long countByAnswerTracking(AnswerTracking answerTracking);
}