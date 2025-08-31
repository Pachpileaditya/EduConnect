package com.project.lms.DTO;

import java.time.LocalDate;
import java.util.Set;

public class TeacherRegistrationRequest {
    private String name;
    private String email;
    private String password;
    private String expertise;
    private LocalDate date;
    private String gender;
    private String address;
    private int pincode;
    private String state;
    private Set<Integer> years;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getPincode() { return pincode; }
    public void setPincode(int pincode) { this.pincode = pincode; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Set<Integer> getYears() { return years; }
    public void setYears(Set<Integer> years) { this.years = years; }

    public static Builder builder() {
        return new Builder();
    }
    public static class Builder {
        private String name;
        private String email;
        private String password;
        private String expertise;
        private LocalDate date;
        private String gender;
        private String address;
        private int pincode;
        private String state;
        private Set<Integer> years;
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder expertise(String expertise) { this.expertise = expertise; return this; }
        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder pincode(int pincode) { this.pincode = pincode; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder years(Set<Integer> years) { this.years = years; return this; }
        public TeacherRegistrationRequest build() {
            TeacherRegistrationRequest req = new TeacherRegistrationRequest();
            req.setName(name);
            req.setEmail(email);
            req.setPassword(password);
            req.setExpertise(expertise);
            req.setDate(date);
            req.setGender(gender);
            req.setAddress(address);
            req.setPincode(pincode);
            req.setState(state);
            req.setYears(years);
            return req;
        }
    }
}