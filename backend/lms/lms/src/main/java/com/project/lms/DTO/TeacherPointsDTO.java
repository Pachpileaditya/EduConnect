package com.project.lms.DTO;

public class TeacherPointsDTO {
    private Integer id;
    private String name;
    private String email;
    private String expertise;
    private Integer totalPoints;
    private Integer questionsAnswered;
    private Integer contentCount;

    public TeacherPointsDTO() {
    }

    public TeacherPointsDTO(Integer id, String name, String email, String expertise, Integer totalPoints) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.expertise = expertise;
        this.totalPoints = totalPoints;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Integer getQuestionsAnswered() {
        return questionsAnswered;
    }

    public void setQuestionsAnswered(Integer questionsAnswered) {
        this.questionsAnswered = questionsAnswered;
    }

    public Integer getContentCount() {
        return contentCount;
    }

    public void setContentCount(Integer contentCount) {
        this.contentCount = contentCount;
    }
}



