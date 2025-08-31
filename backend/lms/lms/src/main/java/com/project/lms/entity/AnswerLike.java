package com.project.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "answer_likes", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "answer_tracking_id"}))
public class AnswerLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "answer_tracking_id")
    private AnswerTracking answerTracking;

    // Constructors
    public AnswerLike() {}
    public AnswerLike(Student student, AnswerTracking answerTracking) {
        this.student = student;
        this.answerTracking = answerTracking;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public AnswerTracking getAnswerTracking() { return answerTracking; }
    public void setAnswerTracking(AnswerTracking answerTracking) { this.answerTracking = answerTracking; }
}