package com.project.lms.DTO;

import java.time.LocalDate;

public class StudentProfileDTO {
    private String Name;
    private String email;
    private String role;
    private LocalDate dob;
    private String gender;
    private String address;
    private int pincode;
    private String state;
    private int year;
    public StudentProfileDTO() {
    }

    
    public StudentProfileDTO(String name, String email, String role, LocalDate dob, String gender, String address,
            int pincode, String state, int year) {
        Name = name;
        this.email = email;
        this.role = role;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.pincode = pincode;
        this.state = state;
        this.year = year;
    }


    public String getName() {
        return Name;
    }
    public void setName(String name) {
        Name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public LocalDate getDob() {
        return dob;
    }
    public void setDob(LocalDate dob) {
        this.dob = dob;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public int getPincode() {
        return pincode;
    }
    public void setPincode(int pincode) {
        this.pincode = pincode;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }

    public static Builder builder() {
        return new Builder();
    }
    public static class Builder {
        private String Name;
        private String email;
        private String role;
        private LocalDate dob;
        private String gender;
        private String address;
        private int pincode;
        private String state;
        private int year;
        public Builder name(String name) { this.Name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder dob(LocalDate dob) { this.dob = dob; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder pincode(int pincode) { this.pincode = pincode; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder year(int year) { this.year = year; return this; }
        public StudentProfileDTO build() {
            return new StudentProfileDTO(Name, email, role, dob, gender, address, pincode, state, year);
        }
    }
    
}
