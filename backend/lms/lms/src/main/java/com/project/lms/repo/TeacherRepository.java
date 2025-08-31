package com.project.lms.repo;


import com.project.lms.entity.Teacher;
import com.project.lms.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Integer> 
{
    // Add custom methods as needed
    Teacher findByUser(User user);
    Optional<Teacher> findByUserId(Integer userId);

    public Integer findByTotalPoints(Teacher teacher);

}
