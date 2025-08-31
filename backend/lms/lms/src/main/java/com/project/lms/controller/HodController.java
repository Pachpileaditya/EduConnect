// package com.project.lms.controller;

// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.project.lms.DTO.HodDTO;
// import com.project.lms.DTO.TeacherPointsDTO;
// import com.project.lms.entity.Teacher;
// import com.project.lms.service.HodService;
// import com.project.lms.service.TeacherService;

// @RestController
// @RequestMapping("/api/hod")
// @CrossOrigin(origins = "http://localhost:5173")
// public class HodController 
// {
//     @Autowired
//     private HodService hodService;

//     @Autowired
//     private TeacherService teacherService;

//     public HodController()
//     {
//     }

//     @GetMapping("/points")
//     public ResponseEntity<Integer> getTeacherPoints(@RequestParam Integer teacherId) 
//     {
//         Teacher teacher = teacherService.findTeacherById(teacherId);
//         Integer teacherPoints = 0;
//         if(teacher!=null)
//         {
//             teacherPoints = hodService.getTeacherPoints(teacher);
//         }

//         return ResponseEntity.ok(teacherPoints);
//     }
    
//     @GetMapping("/profile/{hodId}")
//     public ResponseEntity<HodDTO> getHodProfile(@PathVariable Integer hodId) {
//         HodDTO hodProfile = hodService.getHodProfile(hodId);
//         if (hodProfile != null) {
//             return ResponseEntity.ok(hodProfile);
//         }
//         return ResponseEntity.notFound().build();
//     }
    
//     @GetMapping("/teachers/{hodId}")
//     public ResponseEntity<List<TeacherPointsDTO>> getAllTeachersWithPoints(@PathVariable Integer hodId) {
//         List<TeacherPointsDTO> teachers = hodService.getAllTeachersWithPoints(hodId);
//         return ResponseEntity.ok(teachers);
//     }
    
//     @GetMapping("/top-teachers/{hodId}")
//     public ResponseEntity<List<TeacherPointsDTO>> getTopPerformingTeachers(
//             @PathVariable Integer hodId,
//             @RequestParam(defaultValue = "5") int limit) {
//         List<TeacherPointsDTO> topTeachers = hodService.getTopPerformingTeachers(hodId, limit);
//         return ResponseEntity.ok(topTeachers);
//     }
    
//     @GetMapping("/dashboard-stats/{hodId}")
//     public ResponseEntity<Object> getDashboardStats(@PathVariable Integer hodId) {
//         HodDTO hodProfile = hodService.getHodProfile(hodId);
//         List<TeacherPointsDTO> allTeachers = hodService.getAllTeachersWithPoints(hodId);
//         List<TeacherPointsDTO> topTeachers = hodService.getTopPerformingTeachers(hodId, 5);
        
//         int totalPoints = allTeachers.stream()
//             .mapToInt(TeacherPointsDTO::getTotalPoints)
//             .sum();
        
//         int avgPoints = allTeachers.isEmpty() ? 0 : totalPoints / allTeachers.size();
        
//         return ResponseEntity.ok(Map.of(
//             "hodProfile", hodProfile,
//             "totalTeachers", allTeachers.size(),
//             "totalPoints", totalPoints,
//             "averagePoints", avgPoints,
//             "topTeachers", topTeachers
//         ));
//     }
// }
