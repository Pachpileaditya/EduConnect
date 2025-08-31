package com.project.lms.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.lms.DTO.AnswerDTO;
import com.project.lms.DTO.AnswerTrackingDTO;
import com.project.lms.DTO.ContentSubjectDTO;
import com.project.lms.DTO.QuestionAnswerDTO;
import com.project.lms.DTO.QuestionDTO;
import com.project.lms.DTO.StudentDTO;
import com.project.lms.DTO.SubjectDTO;
import com.project.lms.DTO.SubjectNamesDTO;
import com.project.lms.DTO.TeacherDTO;
import com.project.lms.DTO.TeacherNameDTO;
import com.project.lms.DTO.TeacherProfileDTO;
import com.project.lms.DTO.UnitDTO;
import com.project.lms.DTO.UserDTO;
import com.project.lms.DTO.YearDTO;
import com.project.lms.entity.Answer;
import com.project.lms.entity.AnswerTracking;
import com.project.lms.entity.Content;
import com.project.lms.entity.Question;
import com.project.lms.entity.Student;
import com.project.lms.entity.Subject;
import com.project.lms.entity.Teacher;
import com.project.lms.entity.Unit;
import com.project.lms.entity.User;
import com.project.lms.entity.Year;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.service.AnswerService;
import com.project.lms.service.AnswerTrackingService;
import com.project.lms.service.ContentService;
import com.project.lms.service.QuestionService;
import com.project.lms.service.SubjectService;
import com.project.lms.service.TeacherService;
import com.project.lms.service.UnitService;
import com.project.lms.service.UserService;
import com.project.lms.service.YearService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.http.MediaType;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/teachers")
@PreAuthorize("hasAuthority('TEACHER')")
public class TeacherController {

    private YearService yearService;
    private TeacherService teacherService;
    private UserService userService;
    private SubjectService subjectService;
    private UnitService unitService;
    private ContentService contentService;
    private QuestionService questionService;
    private AnswerService answerService;
    private AnswerTrackingService answerTrackingService;

    @Autowired
    public TeacherController(YearService yearService,
            TeacherService teacherService,
            UserService userService,
            SubjectService subjectService,
            UnitService unitService,
            ContentService contentService,
            QuestionService questionService,
            AnswerService answerService,
            AnswerTrackingService answerTrackingService) {
        this.yearService = yearService;
        this.teacherService = teacherService;
        this.userService = userService;
        this.subjectService = subjectService;
        this.unitService = unitService;
        this.contentService = contentService;
        this.questionService = questionService;
        this.answerService = answerService;
        this.answerTrackingService = answerTrackingService;
    }

    // get teacher by id
    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Integer id) {
        Teacher teacher = teacherService.findTeacherById(id);
        if (teacher == null) {
            return ResponseEntity.notFound().build();
        }
        TeacherDTO teacherDTO = convertToTeacherDTO(teacher);
        return ResponseEntity.ok(teacherDTO);
    }

    // Helper method to convert Teacher entity to TeacherDTO
    private TeacherDTO convertToTeacherDTO(Teacher teacher) {
        User user = teacher.getUser();
        UserDTO userDTO = new UserDTO(user.getId(), user.getName(), user.getEmail());
        Set<Integer> yearIds = teacher.getYears()
                .stream()
                .map(Year::getId)
                .collect(Collectors.toSet());
        return new TeacherDTO(teacher.getId(), teacher.getExpertise(), teacher.getTotalPoints(), userDTO, yearIds);
    }

    // update teacher profile

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDTO> updateTeacher(@PathVariable Integer id,
            @RequestBody TeacherDTO teacherDTO) {
        // Retrieve existing teacher by id
        Teacher existingTeacher = teacherService.findTeacherById(id);
        if (existingTeacher == null) {
            return ResponseEntity.notFound().build();
        }

        // Update basic teacher fields
        existingTeacher.setExpertise(teacherDTO.getExpertise());
        existingTeacher.setTotalPoints(teacherDTO.getTotalPoints());

        // Update nested User details
        if (teacherDTO.getUser() != null) {
            User user = existingTeacher.getUser();
            if (user == null) {
                user = new User();
            }
            user.setName(teacherDTO.getUser().getName());
            user.setEmail(teacherDTO.getUser().getEmail());
            // Optionally update other fields like password if needed.
            existingTeacher.setUser(user);
        }

        // Update associated Years
        Set<Year> updatedYears = new HashSet<>();
        if (teacherDTO.getYearIds() != null) {
            for (Integer yearId : teacherDTO.getYearIds()) {
                Year year = yearService.findYearById(yearId);
                if (year != null) {
                    updatedYears.add(year);
                } else {
                    // Optionally, handle missing Year (e.g., log error or return a bad request)
                    return ResponseEntity.badRequest()
                            .body(null);
                }
            }
        }
        existingTeacher.setYears(updatedYears);

        // Save the updated teacher entity
        Teacher savedTeacher = teacherService.saveTeacher(existingTeacher);

        // Convert the saved entity to DTO for response
        TeacherDTO responseDTO = convertToTeacherDTO(savedTeacher);
        return ResponseEntity.ok(responseDTO);
    }

    // delete teacher account
    @DeleteMapping("/{teacherId}")
    public ResponseEntity<?> deleteTeacher(@PathVariable int teacherId) {
        if (!teacherService.teacherExits(teacherId)) {
            return ResponseEntity.badRequest().body("Teacher not exites wiht id = " + teacherId);
        }

        teacherService.deleteTeacherById(teacherId);

        return ResponseEntity.ok("Teacher deleted with id = " + teacherId);

    }

    // teacher and year CRUD

    // get all years teacher added
    @GetMapping("/years/{teacherId}")
    public ResponseEntity<List<YearDTO>> getAllYears(@PathVariable int teacherId) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            if (teacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            List<Year> theYears = yearService.getYearsByTeacherId(teacherId);
            List<YearDTO> yearDTOs = convertToYearDTO(theYears);
            return ResponseEntity.ok(yearDTOs);

        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve years: " + e.getMessage());
        }
    }

    public List<YearDTO> convertToYearDTO(List<Year> years) {
        return years.stream()
                .map(year -> new YearDTO(year.getId(), year.getName()))
                .collect(Collectors.toList());
    }

    // add years
    @PostMapping("/years/{teacherId}")
    public ResponseEntity<String> addYears(@PathVariable int teacherId, @RequestBody List<Year> years) {
        try {
            if (!teacherService.teacherExits(teacherId)) {
                throw new ResourceNotFoundException("Teacher does not exist with ID: " + teacherId);
            }

            Teacher teacher = teacherService.findTeacherById(teacherId);

            for (Year year : years) {
                Year theYear = yearService.findYearById(year.getId());
                if (theYear == null) {
                    throw new ResourceNotFoundException("Year with ID " + year.getId() + " not found.");
                }
                teacher.addYear(theYear);
            }

            teacherService.saveTeacher(teacher);
            return ResponseEntity.ok("Years added successfully.");

        } catch (Exception e) {
            throw new RuntimeException("Failed to add years: " + e.getMessage());
        }
    }

    // delete year
    @DeleteMapping("/years/{teacherId}")
    public ResponseEntity<String> deleteYears(@PathVariable int teacherId, @RequestBody List<Year> years) {
        try {
            if (!teacherService.teacherExits(teacherId)) {
                throw new ResourceNotFoundException("Teacher does not exist with ID: " + teacherId);
            }

            Teacher teacher = teacherService.findTeacherById(teacherId);

            for (Year year : years) {
                Year theYear = yearService.findYearById(year.getId());
                if (theYear == null) {
                    throw new ResourceNotFoundException("Year with ID " + year.getId() + " not found.");
                }
                teacher.removeYear(theYear);
            }

            teacherService.saveTeacher(teacher);
            return ResponseEntity.ok("Year(s) deleted successfully.");

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete years: " + e.getMessage());
        }
    }

    // get subject for teacher year-wise
    @GetMapping("/{teacherId}/{yearId}")
    public ResponseEntity<?> getSubjectsByTeachersAndYears(@PathVariable int teacherId, @PathVariable int yearId) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            Year year = yearService.findYearById(yearId);

            if (teacher == null || year == null) {
                throw new ResourceNotFoundException("Either teacher or year not found.");
            }

            List<Subject> subjects = subjectService.getAllSubjectsByTeacherAndYear(teacher, year);
            List<SubjectNamesDTO> subjectNamesDTOs = toSubjectNamesDTOList(subjects);

            return ResponseEntity.ok(subjectNamesDTOs);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch subjects: " + e.getMessage());
        }
    }

    public static List<SubjectNamesDTO> toSubjectNamesDTOList(List<Subject> subjects) {
        return subjects.stream()
                .map(subject -> new SubjectNamesDTO(subject.getId(), subject.getName()))
                .collect(Collectors.toList());
    }

    // get all subjects for teacher
    @GetMapping("/subjects/{teacherId}")
    public ResponseEntity<Set<SubjectDTO>> getSubjectsForTeacher(@PathVariable int teacherId) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);

            if (teacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            Set<SubjectDTO> subjectDTOs = convertToSubjectDTO(teacher.getSubjects());
            return ResponseEntity.ok(subjectDTOs);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch subjects for teacher: " + e.getMessage());
        }
    }

    private Set<SubjectDTO> convertToSubjectDTO(Set<Subject> subjects) {
        return subjects.stream()
                .map(subject -> new SubjectDTO(subject.getId(), subject.getName()))
                .collect(Collectors.toSet());
    }

    // add subjects
    @PostMapping("/add-subjects/{teacherId}")
    public ResponseEntity<?> addSubjects(@PathVariable int teacherId,
            @RequestBody List<SubjectNamesDTO> subjectNamesDTOs) {
        try {
            Teacher theTeacher = teacherService.findTeacherById(teacherId);
            if (theTeacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            Set<Subject> existingSubjects = theTeacher.getSubjects();
            if (existingSubjects == null) {
                existingSubjects = new HashSet<>();
            }

            for (SubjectNamesDTO sn : subjectNamesDTOs) {
                Subject subject = subjectService.getSubjectById(sn.getId());
                if (subject == null) {
                    throw new ResourceNotFoundException("Subject not found with ID: " + sn.getId());
                }
                existingSubjects.add(subject);
            }

            theTeacher.setSubjects(existingSubjects);
            teacherService.saveTeacher(theTeacher);

            return ResponseEntity.ok("Subjects added successfully without losing existing ones.");
        } catch (Exception e) {
            throw new RuntimeException("Failed to add subjects: " + e.getMessage());
        }
    }

    // delete subject
    @DeleteMapping("/delete-subject/{teacherId}/{subjectId}")
    public ResponseEntity<String> deleteSubjects(@PathVariable int teacherId, @PathVariable int subjectId) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            if (teacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            Subject subject = subjectService.getSubjectById(subjectId);
            if (subject == null) {
                throw new ResourceNotFoundException("Subject not found with ID: " + subjectId);
            }

            Set<Subject> subjects = teacher.getSubjects();
            subjects.remove(subject);
            teacher.setSubjects(subjects);
            teacherService.saveTeacher(teacher);

            return ResponseEntity.ok("Subject deleted successfully.");
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete subject: " + e.getMessage());
        }
    }

    // Handle multipart/form-data (file upload or url)
    @PostMapping(value = "/add/{teacherId}/{subjectId}/{unitId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContentSubjectDTO> addContentMultipart(
            @PathVariable int teacherId,
            @PathVariable int subjectId,
            @PathVariable int unitId,
            @RequestPart("title") String contentTitle,
            @RequestPart("description") String contentDesc,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "url", required = false) String url) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            if (teacher == null || subject == null || unit == null) {
                throw new ResourceNotFoundException("Invalid teacher, subject, or unit.");
            }

            String fileURL = null;
            if (file != null && !file.isEmpty()) {
                fileURL = contentService.uploadPdfToCloudinary(file);
            } else if (url != null && !url.trim().isEmpty()) {
                fileURL = url.trim();
            } else {
                throw new RuntimeException("Either a file or a URL must be provided.");
            }

            Content content = new Content();
            content.setTitle(contentTitle);
            content.setDescription(contentDesc);
            content.setFileUrl(fileURL);
            content.setTeacher(teacher);
            content.setSubject(subject);
            content.setUnit(unit);

            Content savedContent = contentService.addContent(content);
            ContentSubjectDTO contentSubjectDTO = convertToContentSubjectDTO(savedContent);

            return ResponseEntity.ok(contentSubjectDTO);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to add content: " + e.getMessage());
        }
    }

    // Handle application/json (URL only)
    @PostMapping(value = "/add/{teacherId}/{subjectId}/{unitId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContentSubjectDTO> addContentJson(
            @PathVariable int teacherId,
            @PathVariable int subjectId,
            @PathVariable int unitId,
            @RequestBody Map<String, Object> jsonBody) {
        try {
            String contentTitle = (String) jsonBody.get("title");
            String contentDesc = (String) jsonBody.get("description");
            String url = (String) jsonBody.get("url");

            Teacher teacher = teacherService.findTeacherById(teacherId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            if (teacher == null || subject == null || unit == null) {
                throw new ResourceNotFoundException("Invalid teacher, subject, or unit.");
            }

            if (url == null || url.trim().isEmpty()) {
                throw new RuntimeException("URL must be provided in JSON mode.");
            }

            Content content = new Content();
            content.setTitle(contentTitle);
            content.setDescription(contentDesc);
            content.setFileUrl(url.trim());
            content.setTeacher(teacher);
            content.setSubject(subject);
            content.setUnit(unit);

            Content savedContent = contentService.addContent(content);
            ContentSubjectDTO contentSubjectDTO = convertToContentSubjectDTO(savedContent);

            return ResponseEntity.ok(contentSubjectDTO);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add content: " + e.getMessage());
        }
    }

    // teacher update content (multipart/form-data: PDF re-upload or URL update)
    @PutMapping(value = "/update/{teacherId}/{subjectId}/{unitId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContentSubjectDTO> updateContentMultipart(
            @PathVariable int teacherId,
            @PathVariable int subjectId,
            @PathVariable int unitId,
            @RequestPart("title") String contentTitle,
            @RequestPart("description") String contentDesc,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "url", required = false) String url) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            if (teacher == null || subject == null || unit == null) {
                throw new ResourceNotFoundException("Invalid teacher, subject, or unit.");
            }

            Content content = contentService.getContentByTeacherSubjectAndUnit(teacher, subject, unit);
            if (content == null) {
                throw new ResourceNotFoundException("Content not found.");
            }

            String fileURL = null;
            if (file != null && !file.isEmpty()) {
                fileURL = contentService.uploadPdfToCloudinary(file);
            } else if (url != null && !url.trim().isEmpty()) {
                fileURL = url.trim();
            } else {
                fileURL = content.getFileUrl(); // keep existing if nothing new
            }

            content.setTitle(contentTitle);
            content.setDescription(contentDesc);
            content.setFileUrl(fileURL);

            Content updatedContent = contentService.addContent(content);
            ContentSubjectDTO contentSubjectDTO = convertToContentSubjectDTO(updatedContent);

            return ResponseEntity.ok(contentSubjectDTO);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update content: " + e.getMessage());
        }
    }

    // teacher update content (application/json: URL update only)
    @PutMapping(value = "/update/{teacherId}/{subjectId}/{unitId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContentSubjectDTO> updateContentJson(
            @PathVariable int teacherId,
            @PathVariable int subjectId,
            @PathVariable int unitId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            if (teacher == null || subject == null || unit == null) {
                throw new ResourceNotFoundException("Invalid teacher, subject, or unit.");
            }

            Content content = contentService.getContentByTeacherSubjectAndUnit(teacher, subject, unit);
            if (content == null) {
                throw new ResourceNotFoundException("Content not found.");
            }

            content.setTitle((String) requestBody.get("title"));
            content.setDescription((String) requestBody.get("description"));
            content.setFileUrl((String) requestBody.get("fileURL"));

            Content updatedContent = contentService.addContent(content);
            ContentSubjectDTO contentSubjectDTO = convertToContentSubjectDTO(updatedContent);

            return ResponseEntity.ok(contentSubjectDTO);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update content: " + e.getMessage());
        }
    }

    // convert content to contentSubjectDTO
    private ContentSubjectDTO convertToContentSubjectDTO(Content content) {

        // get unitDTO
        Unit unit = content.getUnit();
        UnitDTO unitDTO = new UnitDTO(unit.getId(), unit.getUnitNo());

        // create contentSubjectDTO
        ContentSubjectDTO contentSubjectDTO = new ContentSubjectDTO();
        contentSubjectDTO.setUnitNo(unitDTO);
        contentSubjectDTO.setTitle(content.getTitle());
        contentSubjectDTO.setDescription(content.getDescription());
        contentSubjectDTO.setFileURL(content.getFileUrl());

        return contentSubjectDTO;

    }

    // teacher delete content
    @DeleteMapping("/delete/{teacherId}/{subjectId}/{unitId}")
    public ResponseEntity<String> deleteContent(@PathVariable int teacherId,
            @PathVariable int subjectId,
            @PathVariable int unitId) {
        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            Subject subject = subjectService.getSubjectById(subjectId);
            Unit unit = unitService.getUnit(unitId);

            if (teacher == null || subject == null || unit == null) {
                throw new ResourceNotFoundException("Invalid teacher, subject, or unit.");
            }

            Content content = contentService.getContentByTeacherSubjectAndUnit(teacher, subject, unit);
            if (content == null) {
                throw new ResourceNotFoundException("Content not found.");
            }

            contentService.deleteContent(content);

            return ResponseEntity.ok("Content deleted successfully.");

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete content: " + e.getMessage());
        }
    }

    // // read subject questions unit wise
    // @GetMapping("/questions/{subjectId}/{unitId}")
    // public ResponseEntity<?> getQuestionsSubjectWise(@PathVariable int subjectId,
    // @PathVariable int unitId) {
    // Subject subject = subjectService.getSubjectById(subjectId);
    // Unit unit = unitService.getUnit(unitId);

    // List<Question> questions =
    // questionService.getQuestionBySubjectAndUnit(subject, unit);

    // List<QuestionDTO> questionDTOs = convertToQuestionDTO(questions);

    // return ResponseEntity.ok(questionDTOs);

    // }

    @GetMapping("/question/{subjectId}/{teacherId}")
    public ResponseEntity<?> getAllQuestionForSubject(
            @PathVariable int subjectId,
            @PathVariable int teacherId) {
        try {
            Subject subject = subjectService.getSubjectById(subjectId);
            Teacher teacher = teacherService.findTeacherById(teacherId);

            if (subject == null) {
                throw new ResourceNotFoundException("Subject not found with ID: " + subjectId);
            }

            if (teacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            List<Question> questions = questionService.getQuestionBySubject(subject);

            List<QuestionAnswerDTO> questionAnswerDTOList = new ArrayList<>();

            for (Question question : questions) {
                QuestionDTO questionDTO = convertToQuestionDTO(question);

                // Only fetch answer given by this teacher
                List<Answer> teacherAnswers = answerService.getAnswerByTeacherAndQuestion(teacher, question);

                QuestionAnswerDTO qaDTO = new QuestionAnswerDTO();
                qaDTO.setQuestionDTO(questionDTO);
                qaDTO.setAnswerDTO(teacherAnswers.isEmpty() ? null : convertToAnswerDTO(teacherAnswers.get(0)));

                questionAnswerDTOList.add(qaDTO);
            }

            return ResponseEntity.ok(questionAnswerDTOList);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch questions: " + e.getMessage());
        }
    }

    private QuestionDTO convertToQuestionDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setText(question.getText());
        dto.setStudentDTO(convertToStudentDTO(question.getStudent()));
        dto.setUnitDTO(convertToUnitDTO(question.getUnit()));
        return dto;
    }

    private AnswerDTO convertToAnswerDTO(Answer answer) {
        if (answer == null)
            return null;

        AnswerDTO dto = new AnswerDTO();
        dto.setAnswerId(answer.getId());
        dto.setText(answer.getText());
        dto.setCreatedAt(answer.getCreatedAt());

        // Handle Teacher name
        if (answer.getTeacher() != null) {
            TeacherNameDTO teacherNameDTO = new TeacherNameDTO();
            teacherNameDTO.setName(answer.getTeacher().getUser().getName());
            dto.setTeacherNameDTO(teacherNameDTO);
        }

        // Handle tracking info
        AnswerTracking tracking = answer.getTracking();
        if (tracking != null) {
            dto.setAnswerTrackingDTO(convertToAnswerTrackingDTO(tracking));
        }

        return dto;
    }

    private AnswerTrackingDTO convertToAnswerTrackingDTO(AnswerTracking tracking) {
        if (tracking == null)
            return null;

        AnswerTrackingDTO dto = new AnswerTrackingDTO();
        dto.setAnswerTrackingId(tracking.getId());
        dto.setLikes(tracking.getLikes());
        dto.setViews(tracking.getViews());
        return dto;
    }

    private StudentDTO convertToStudentDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getUser().getName());
        // dto.setRollNumber(student.getUser().getRollNumber());
        return dto;
    }

    private UnitDTO convertToUnitDTO(Unit unit) {
        UnitDTO dto = new UnitDTO();
        dto.setId(unit.getId());
        dto.setUnitno(unit.getUnitNo());
        return dto;
    }

    private TeacherNameDTO convertToTeacherNameDTO(Teacher teacher) {
        TeacherNameDTO dto = new TeacherNameDTO();
        dto.setTeacherId(teacher.getId());
        dto.setName(teacher.getUser().getName());
        return dto;
    }

    // teacher read the answer for the question
    @GetMapping("/answer/{teacherId}/{questionId}")
    public ResponseEntity<?> getAsnwerForQuestion(@PathVariable int teacherId, @PathVariable int questionId) {
        try {
            Question question = questionService.getQuestionById(questionId);
            Teacher teacher = teacherService.findTeacherById(teacherId);

            if (question == null) {
                throw new ResourceNotFoundException("Question not found with ID: " + questionId);
            }

            if (teacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            List<Answer> answerList = answerService.getAnswerByTeacherAndQuestion(teacher, question);
            List<AnswerDTO> answers = convertTOAnswerDTO(answerList);

            return ResponseEntity.ok(answers);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching answer: " + ex.getMessage());
        }
    }

    // teacher answer the questions
    @PostMapping("/answer/{teacherId}/{questionId}")
    public ResponseEntity<?> answerQuestions(
            @PathVariable int teacherId,
            @PathVariable int questionId,
            @RequestBody Map<String, Object> requestBody) {

        try {
            Teacher teacher = teacherService.findTeacherById(teacherId);
            Question question = questionService.getQuestionById(questionId);

            if (teacher == null) {
                throw new ResourceNotFoundException("Teacher not found with ID: " + teacherId);
            }

            if (question == null) {
                throw new ResourceNotFoundException("Question not found with ID: " + questionId);
            }

            String text = (String) requestBody.get("answerText");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Answer text is required.");
            }

            int points = 2;
            Integer teacherPoints = teacher.getTotalPoints() == null ? 0 : teacher.getTotalPoints();
            teacher.setTotalPoints(teacherPoints + points);
            teacherService.saveTeacher(teacher);

            Answer answer = new Answer();
            answer.setText(text);
            answer.setQuestion(question);
            answer.setTeacher(teacher);
            answer.setPoints(points);

            Answer savedAnswer = answerService.saveAnswer(answer);

            AnswerTracking answerTracking = new AnswerTracking();
            answerTracking.setAnswer(savedAnswer);
            answerTracking.setLikes(0);
            answerTracking.setViews(0);
            answerTrackingService.saveAnswerTracking(answerTracking);

            savedAnswer.setTracking(answerTracking);

            AnswerDTO answerDTO = convertTOAnswerDTO(List.of(savedAnswer)).get(0);
            return ResponseEntity.ok(answerDTO);

        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save answer: " + ex.getMessage());
        }
    }

    public List<AnswerDTO> convertTOAnswerDTO(List<Answer> answers) {
        return answers.stream()
                .map(answer -> {
                    // Safely extract teacher name
                    Teacher teacher = answer.getTeacher();
                    User teacherUser = (teacher != null) ? teacher.getUser() : null;
                    TeacherNameDTO teacherNameDTO = (teacher != null && teacherUser != null)
                            ? new TeacherNameDTO(teacher.getId(), teacherUser.getName())
                            : null;

                    // Safely extract question details
                    Question question = answer.getQuestion();
                    Student student = (question != null) ? question.getStudent() : null;
                    User studentUser = (student != null) ? student.getUser() : null;
                    Subject subject = (question != null) ? question.getSubject() : null;
                    Unit unit = (question != null) ? question.getUnit() : null;

                    QuestionDTO questionDTO = (question != null)
                            ? new QuestionDTO(
                                    question.getId(),
                                    question.getText(),
                                    (student != null && studentUser != null)
                                            ? new StudentDTO(student.getId(), studentUser.getName())
                                            : null,
                                    (unit != null)
                                            ? new UnitDTO(unit.getId(), unit.getUnitNo())
                                            : null)
                            : null;

                    // Safely extract tracking info
                    AnswerTracking tracking = answer.getTracking();
                    AnswerTrackingDTO trackingDTO = (tracking != null)
                            ? new AnswerTrackingDTO(tracking.getId(), tracking.getLikes(), tracking.getViews())
                            : null;

                    return new AnswerDTO(
                            answer.getId(),
                            answer.getText(),
                            teacherNameDTO,
                            questionDTO,
                            trackingDTO,
                            answer.getCreatedAt());
                })
                .collect(Collectors.toList());
    }

    @PutMapping("/update-answer/{answerId}")
    public ResponseEntity<?> updateAnswerEntity(@PathVariable int answerId, @RequestBody String answerText) {
        try {
            Answer answer = answerService.getAnswerById(answerId);
            if (answer == null) {
                throw new ResourceNotFoundException("Answer not found with ID: " + answerId);
            }

            if (answerText == null || answerText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Answer text must not be empty.");
            }

            answer.setText(answerText);
            Answer updatedAnswer = answerService.saveAnswer(answer);

            AnswerDTO answerDTO = convertTOAnswerDTO(List.of(updatedAnswer)).get(0);

            return ResponseEntity.ok(answerDTO);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update answer: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete-answer/{answerId}")
    public ResponseEntity<?> deleteAnswer(@PathVariable int answerId) {
        try {
            Answer answer = answerService.getAnswerById(answerId);
            if (answer == null) {
                throw new ResourceNotFoundException("Answer not found with ID: " + answerId);
            }

            answerService.deleteAnswer(answer);
            return ResponseEntity.ok("Answer deleted successfully with id = " + answerId);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete answer: " + ex.getMessage());
        }
    }

    @GetMapping("/profile/{teacherId}")
    public ResponseEntity<?> getProfile(@PathVariable int teacherId) {
        try {
            Teacher teacherEntity = teacherService.findTeacherById(teacherId);
            User userEntity = userService.findUserById(teacherEntity.getUser().getId());
            
            if(teacherEntity == null || userEntity == null)
            {
                throw new ResourceNotFoundException("User not found with id = " + teacherId);
            }

            TeacherProfileDTO teacherProfileDTO = new TeacherProfileDTO();
            teacherProfileDTO.setName(userEntity.getName());
            teacherProfileDTO.setEmail(userEntity.getEmail());
            teacherProfileDTO.setRole(String.valueOf(userEntity.getRole()));
            teacherProfileDTO.setDob(userEntity.getDob());
            teacherProfileDTO.setGender(userEntity.getGender());
            teacherProfileDTO.setAddress(userEntity.getAddress());
            teacherProfileDTO.setPincode(userEntity.getPincode());
            teacherProfileDTO.setState(userEntity.getState());
            teacherProfileDTO.setExperties(teacherEntity.getExpertise());
            teacherProfileDTO.setTotalPoints(teacherEntity.getTotalPoints());
            return ResponseEntity.ok(teacherProfileDTO);

            
        } catch (ResourceNotFoundException e) {
            // TODO: handle exception
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch teacher profile : " + e.getMessage());
        }


    }
    

}
