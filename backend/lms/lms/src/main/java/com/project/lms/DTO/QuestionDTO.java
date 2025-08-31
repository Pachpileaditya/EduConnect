package com.project.lms.DTO;

public class QuestionDTO 
{

    private Integer id;
    private String text;
    private StudentDTO studentDTO;
    private UnitDTO unitDTO;
    public QuestionDTO() {
    }
    public QuestionDTO(Integer id, String text, StudentDTO studentDTO,UnitDTO unitDTO) {
        this.id = id;
        this.text = text;
        this.studentDTO = studentDTO;
        this.unitDTO = unitDTO;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public StudentDTO getStudentDTO() {
        return studentDTO;
    }
    public void setStudentDTO(StudentDTO studentDTO) {
        this.studentDTO = studentDTO;
    }
    
    public UnitDTO getUnitDTO() {
        return unitDTO;
    }
    public void setUnitDTO(UnitDTO unitDTO) {
        this.unitDTO = unitDTO;
    }

    


    
}
