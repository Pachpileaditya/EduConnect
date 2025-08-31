package com.project.lms.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.project.lms.DTO.AnswerDTO;
import com.project.lms.DTO.AnswerTrackingDTO;
import com.project.lms.DTO.QuestionDTO;
import com.project.lms.DTO.StudentDTO;
import com.project.lms.DTO.StudentProfileDTO;
import com.project.lms.DTO.SubjectDTO;
import com.project.lms.DTO.TeacherNameDTO;
import com.project.lms.DTO.StudentProfileDTO;
import com.project.lms.DTO.UnitDTO;
import com.project.lms.DTO.YearDTO;
import com.project.lms.entity.Answer;
import com.project.lms.entity.AnswerTracking;
import com.project.lms.entity.Question;
import com.project.lms.entity.Student;
import com.project.lms.entity.Subject;
import com.project.lms.entity.Teacher;
import com.project.lms.entity.Unit;
import com.project.lms.entity.User;
import com.project.lms.entity.Year;
import com.project.lms.entity.AnswerLike;
import com.project.lms.repo.AnswerLikeRepository;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.service.AnswerService;
import com.project.lms.service.AnswerTrackingService;
import com.project.lms.service.QuestionService;
import com.project.lms.service.StudentService;
import com.project.lms.service.SubjectService;
import com.project.lms.service.UnitService;
import com.project.lms.service.UserService;
import com.project.lms.service.YearService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/students")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAuthority('STUDENT')")
public class StudentController {

    private SubjectService subjectService;
    private YearService yearService;
    private StudentService studentService;
    private UnitService unitService;
    private QuestionService questionService;
    private AnswerService answerService;
    private AnswerTrackingService answerTrackingService;
    private UserService userService;
    private final AnswerLikeRepository answerLikeRepository;

    public StudentController(SubjectService subjectService,
            YearService yearService, UnitService unitService, StudentService studentService,
            QuestionService questionService2,
            AnswerService answerService, AnswerTrackingService answerTrackingService, UserService userService,
            AnswerLikeRepository answerLikeRepository) {
        this.subjectService = subjectService;
        this.yearService = yearService;
        this.unitService = unitService;
        this.questionService = questionService2;
        this.studentService = studentService;
        this.answerService = answerService;
        this.answerTrackingService = answerTrackingService;
        this.userService = userService;
        this.answerLikeRepository = answerLikeRepository;
    }

    // Get student year
    @GetMapping("/year/{studentId}")
    public ResponseEntity<?> getStudentYear(@PathVariable int studentId) {
        try {
            Student std = studentService.getStudentById(studentId);
            if (std == null) {
                throw new ResourceNotFoundException("Student not found with ID: " + studentId);
            }

            Integer yearId = std.getYear();
            System.out.println("year = " + yearId);
            Year yearEntity = yearService.findYearById(yearId);
            if (yearEntity == null) {
                throw new ResourceNotFoundException("Year not found for student ID: " + studentId);
            }

            YearDTO yearDTO = new YearDTO();
            yearDTO.setId(yearEntity.getId());
            yearDTO.setYear(yearEntity.getName());

            return ResponseEntity.ok(yearDTO);

        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching the student's year.");
        }
    }

    // get student subjects
    @GetMapping("/subjects/{studentId}")
    public ResponseEntity<?> getStudentSubjectsEntity(@PathVariable int studentId) {
        Student student = studentService.getStudentById(studentId);
        if (student == null) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }

        Set<Subject> subjects = student.getSubjects();
        List<SubjectDTO> subjectDTOs = convertSubjectToDTOList(subjects);
        return ResponseEntity.ok(subjectDTOs);
    }

    public List<SubjectDTO> convertSubjectToDTOList(Set<Subject> subjects) {
        return subjects.stream()
                .map(subject -> new SubjectDTO(subject.getId(), subject.getName()))
                .collect(Collectors.toList());
    }

    // add student subjects
    @PostMapping("/subjects/add/{studentId}")
    public ResponseEntity<?> addSubject(@PathVariable int studentId, @RequestBody List<SubjectDTO> subjectDTOs) {
        Student student = studentService.getStudentById(studentId);
        if (student == null) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }

        Set<Subject> studentSubjects = student.getSubjects();
        for (SubjectDTO s : subjectDTOs) {
            Subject subject = subjectService.getSubjectById(s.getSubjectId());
            if (subject == null) {
                throw new ResourceNotFoundException("Subject not found with ID: " + s.getSubjectId());
            }
            studentSubjects.add(subject);
        }

        studentService.saveStudent(student);
        return ResponseEntity.ok("Subjects added successfully");
    }

    // delete subject by student
    @DeleteMapping("/subject/{studentId}/{subjectId}")
    public ResponseEntity<?> deleteSubject(@PathVariable int studentId, @PathVariable int subjectId) {
        Student student = studentService.getStudentById(studentId);
        if (student == null) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }

        Subject subject = subjectService.getSubjectById(subjectId);
        if (subject == null) {
            throw new ResourceNotFoundException("Subject not found with ID: " + subjectId);
        }

        boolean removed = student.getSubjects().remove(subject);
        if (!removed) {
            throw new ResourceNotFoundException(
                    "Subject with ID: " + subjectId + " is not assigned to student ID: " + studentId);
        }

        studentService.saveStudent(student); // Save after removal
        return ResponseEntity.ok("Subject removed successfully -> " + subject.getName());
    }

    // read subject content from content controller

    // Get all questions asked by student for a subject
    @GetMapping("/questions/{studentId}/{subjectId}")
    public ResponseEntity<?> getAllQuestions(@PathVariable int studentId, @PathVariable int subjectId) {
        try {
            Student student = studentService.getStudentById(studentId);
            Subject subject = subjectService.getSubjectById(subjectId);
            List<Question> questions = questionService.getQuestionByStudentAndSubject(student, subject);

            if (questions == null || questions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<QuestionDTO> questionDTOs = convertToQuestionDTO(questions);
            return ResponseEntity.ok(questionDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving questions: " + e.getMessage());
        }
    }

    // Convert Question entity to DTO
    public List<QuestionDTO> convertToQuestionDTO(List<Question> questions) {
        return questions.stream()
                .map(q -> new QuestionDTO(
                        q.getId(),
                        q.getText(),
                        new StudentDTO(q.getStudent().getId(), q.getStudent().getUser().getName()),
                        new UnitDTO(q.getUnit().getId(), q.getUnit().getUnitNo())))
                .collect(Collectors.toList());
    }

    // Get specific student's question for a unit in a subject
    @GetMapping("/question/{studentId}/{subjectId}/{unitId}")
    public ResponseEntity<?> getStudentUnitWiseQuestions(@PathVariable int studentId,
            @PathVariable int subjectId,
            @PathVariable int unitId) {
        try {
            Student student = studentService.getStudentById(studentId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            List<Question> questions = questionService.getQuestionByStudentAndSubjectAndUnit(student, subject, unit);

            if (questions == null || questions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Questions not found");
            }

            List<QuestionDTO> questionDTOs = convertToQuestionDTO(questions);
            return ResponseEntity.ok(questionDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving questions: " + e.getMessage());
        }
    }

    // Get common (FAQ) questions asked by students for a unit in a subject
    @GetMapping("/question/{subjectId}/{unitId}")
    public ResponseEntity<?> getCommonUnitWiseQuestions(@PathVariable int subjectId,
            @PathVariable int unitId) {
        try {
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            List<Question> questions = questionService.getQuestionBySubjectAndUnit(subject, unit);

            if (questions == null || questions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Questions not found");
            }

            List<QuestionDTO> questionDTOs = convertToQuestionDTO(questions);
            return ResponseEntity.ok(questionDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving questions: " + e.getMessage());
        }
    }

    // Ask question
    @PostMapping("/question/{studentId}/{subjectId}/{unitId}")
    public ResponseEntity<?> askQuestion(@RequestBody String text,
            @PathVariable int studentId,
            @PathVariable int subjectId,
            @PathVariable int unitId) {
        try {
            Student student = studentService.getStudentById(studentId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            Question question = new Question();
            question.setText(text);
            question.setStudent(student);
            question.setSubject(subject);
            question.setUnit(unit);

            question = questionService.saveQuestion(question);

            QuestionDTO questionDTO = new QuestionDTO(
                    question.getId(),
                    question.getText(),
                    new StudentDTO(question.getStudent().getId(), question.getStudent().getUser().getName()),
                    new UnitDTO(question.getUnit().getId(), question.getUnit().getUnitNo()));

            return ResponseEntity.ok(questionDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to ask question: " + e.getMessage());
        }
    }

    // Update question
    @PutMapping("/question/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable int questionId, @RequestBody String questionText) {
        try {
            Question question = questionService.getQuestionById(questionId);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found with ID: " + questionId);
            }

            question.setText(questionText);
            questionService.saveQuestion(question);

            return ResponseEntity.ok("Question updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating question: " + e.getMessage());
        }
    }

    // Delete question
    @DeleteMapping("/question/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int questionId) {
        try {
            Question question = questionService.getQuestionById(questionId);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found with ID: " + questionId);
            }

            questionService.deleteQuestion(question);
            return ResponseEntity.ok("Question deleted with ID: " + questionId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting question: " + e.getMessage());
        }
    }

    // get answer
    @GetMapping("/answer/{questionId}")
    public ResponseEntity<?> getAnswer(@PathVariable int questionId) {
        try {
            Question question = questionService.getQuestionById(questionId);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found.");
            }

            List<Answer> answers = answerService.getAnswersByQuestion(question);
            if (answers == null || answers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No answers available.");
            }

            List<AnswerDTO> answerDTOs = answers.stream()
                    .map(this::convertToAnswerDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(answerDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve answers.");
        }
    }

    public AnswerDTO convertToAnswerDTO(Answer answer) {
        return new AnswerDTO(
                answer.getId(),
                answer.getText(),
                new TeacherNameDTO(
                        answer.getTeacher().getId(),
                        answer.getTeacher().getUser().getName()),
                new QuestionDTO(
                        answer.getQuestion().getId(),
                        answer.getQuestion().getText(),
                        new StudentDTO(
                                answer.getQuestion().getStudent().getId(),
                                answer.getQuestion().getStudent().getUser().getName()),
                        new UnitDTO(
                                answer.getQuestion().getUnit().getId(),
                                answer.getQuestion().getUnit().getUnitNo())),
                new AnswerTrackingDTO(
                        answer.getTracking().getId(),
                        answer.getTracking().getLikes(),
                        answer.getTracking().getViews()),
                answer.getCreatedAt());
    }

    // like answer (per student)
    @PostMapping("/like-answer/{answerId}/{studentId}")
    public ResponseEntity<String> likeAnswer(@PathVariable int answerId, @PathVariable int studentId) {
        try {
            Answer answer = answerService.getAnswerById(answerId);
            Student student = studentService.getStudentById(studentId);
            if (answer == null || student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Answer or student not found.");
            }
            AnswerTracking tracking = answer.getTracking();
            if (answerLikeRepository.existsByStudentAndAnswerTracking(student, tracking)) {
                return ResponseEntity.badRequest().body("Already liked");
            }
            AnswerLike like = new AnswerLike(student, tracking);
            answerLikeRepository.save(like);
            tracking.setLikes((int) answerLikeRepository.countByAnswerTracking(tracking));
            answerTrackingService.saveAnswerTracking(tracking);
            return ResponseEntity.ok("Answer liked");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to like the answer.");
        }
    }

    // check if student liked answer
    @GetMapping("/has-liked/{answerId}/{studentId}")
    public ResponseEntity<Boolean> hasLiked(@PathVariable int answerId, @PathVariable int studentId) {
        Answer answer = answerService.getAnswerById(answerId);
        Student student = studentService.getStudentById(studentId);
        if (answer == null || student == null) {
            return ResponseEntity.ok(false);
        }
        AnswerTracking tracking = answer.getTracking();
        boolean liked = answerLikeRepository.existsByStudentAndAnswerTracking(student, tracking);
        return ResponseEntity.ok(liked);
    }

    @GetMapping("/profile/{studentId}")
    public ResponseEntity<?> getProfile(@PathVariable int studentId) {
        try {
            
            Student studentEntity = studentService.getStudentById(studentId);
            User userEntity = userService.findUserById(studentEntity.getUser().getId());
            
            if(studentEntity == null || userEntity == null)
            {
                throw new ResourceNotFoundException("User student not found with id = " + studentId);
            }

            StudentProfileDTO studentProfileDTO = new StudentProfileDTO();
            studentProfileDTO.setName(userEntity.getName());
            studentProfileDTO.setEmail(userEntity.getEmail());
            studentProfileDTO.setRole(String.valueOf(userEntity.getRole()));
            studentProfileDTO.setDob(userEntity.getDob());
            studentProfileDTO.setGender(userEntity.getGender());
            studentProfileDTO.setAddress(userEntity.getAddress());
            studentProfileDTO.setPincode(userEntity.getPincode());
            studentProfileDTO.setState(userEntity.getState());
            studentProfileDTO.setYear(studentEntity.getYear());
            return ResponseEntity.ok(studentProfileDTO);

            
        } catch (ResourceNotFoundException e) {
            // TODO: handle exception
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch student profile: " + e.getMessage());
        }
    }
    

}
