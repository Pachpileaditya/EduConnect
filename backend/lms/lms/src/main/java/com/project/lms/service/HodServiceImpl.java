// package com.project.lms.service;

// import java.util.List;
// import java.util.stream.Collectors;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.project.lms.DTO.HodDTO;
// import com.project.lms.DTO.TeacherPointsDTO;
// import com.project.lms.entity.Hod;
// import com.project.lms.entity.Teacher;
// import com.project.lms.entity.User;
// import com.project.lms.repo.HodRepository;
// import com.project.lms.repo.TeacherRepository;

// @Service
// public class HodServiceImpl implements HodService
// {
//     @Autowired
//     private TeacherRepository teacherRepository;
    
//     @Autowired
//     private HodRepository hodRepository;

//     public HodServiceImpl() 
//     {
//     }

//     public HodServiceImpl(TeacherRepository teacherRepository, HodRepository hodRepository) 
//     {
//         this.teacherRepository = teacherRepository;
//         this.hodRepository = hodRepository;
//     }

//     @Override
//     public Integer getTeacherPoints(Teacher teacher) 
//     {
//         return teacher.getTotalPoints() != null ? teacher.getTotalPoints() : 0;
//     }
    
//     @Override
//     public HodDTO getHodProfile(Integer hodId) {
//         Hod hod = hodRepository.findById(hodId).orElse(null);
//         if (hod != null) {
//             User user = hod.getUser();
//             return new HodDTO(
//                 hod.getId(),
//                 user.getName(),
//                 user.getEmail(),
//                 hod.getDepartment(),
//                 hod.getTotalTeachersManaged()
//             );
//         }
//         return null;
//     }
    
//     @Override
//     public List<TeacherPointsDTO> getAllTeachersWithPoints(Integer hodId) {
//         Hod hod = hodRepository.findById(hodId).orElse(null);
//         if (hod != null) {
//             return hod.getManagedTeachers().stream()
//                 .map(teacher -> new TeacherPointsDTO(
//                     teacher.getId(),
//                     teacher.getUser().getName(),
//                     teacher.getUser().getEmail(),
//                     teacher.getExpertise(),
//                     teacher.getTotalPoints()
//                 ))
//                 .collect(Collectors.toList());
//         }
//         return List.of();
//     }
    
//     @Override
//     public List<TeacherPointsDTO> getTopPerformingTeachers(Integer hodId, int limit) {
//         return getAllTeachersWithPoints(hodId).stream()
//             .sorted((t1, t2) -> Integer.compare(t2.getTotalPoints(), t1.getTotalPoints()))
//             .limit(limit)
//             .collect(Collectors.toList());
//     }
    
//     @Override
//     public Hod findByUser(User user) {
//         return hodRepository.findByUser(user).orElse(null);
//     }
    
//     @Override
//     public Hod saveHod(Hod hod) {
//         return hodRepository.save(hod);
//     }
// }