package com.project.lms.DTO;

import java.util.List;

public class HodDTO {
    private Integer id;
    private String name;
    private String email;
    private String department;
    private Integer totalTeachersManaged;
    private List<TeacherPointsDTO> managedTeachers;

    public HodDTO() {
    }

    public HodDTO(Integer id, String name, String email, String department, Integer totalTeachersManaged) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.totalTeachersManaged = totalTeachersManaged;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getTotalTeachersManaged() {
        return totalTeachersManaged;
    }

    public void setTotalTeachersManaged(Integer totalTeachersManaged) {
        this.totalTeachersManaged = totalTeachersManaged;
    }

    public List<TeacherPointsDTO> getManagedTeachers() {
        return managedTeachers;
    }

    public void setManagedTeachers(List<TeacherPointsDTO> managedTeachers) {
        this.managedTeachers = managedTeachers;
    }
}



