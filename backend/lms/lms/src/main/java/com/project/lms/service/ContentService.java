package com.project.lms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.lms.entity.Content;
import com.project.lms.entity.Subject;
import com.project.lms.entity.Teacher;
import com.project.lms.entity.Unit;
import com.project.lms.exception.ResourceNotFoundException;
import com.project.lms.repo.ContentRepository;

import jakarta.transaction.Transactional;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class ContentService 
{

    private ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository,
                         @Value("${cloudinary.cloud_name}") String cloudName,
                         @Value("${cloudinary.api_key}") String apiKey,
                         @Value("${cloudinary.api_secret}") String apiSecret) {
        this.contentRepository = contentRepository;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    private Cloudinary cloudinary;

    public String uploadPdfToCloudinary(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "raw",
                "folder", "lms_pdfs/"
        ));
        return (String) uploadResult.get("secure_url");
    }


    @Transactional
    public Content addContent(Content content)
    {
        return contentRepository.save(content);
    }


    public Content getContentByTeacherSubjectAndUnit(Teacher teacher, Subject subject, Unit unit) {
        return contentRepository.findByTeacherAndSubjectAndUnit(teacher, subject, unit);
    }


    public Content getContentById(int contentId) {
       return contentRepository.findById(contentId)
                            .orElseThrow(()->new RuntimeException("content not found with id = " + contentId));
    }


    public boolean contentExits(int contentId) {
        Optional<Content> content = contentRepository.findById(contentId);

        if(!content.isPresent()){
            return false;
        }
        return true;
    }


    @Transactional
    public void deleteContent(Content content) {
        contentRepository.delete(content);
    }

    public List<Content> getContentsByTeacherAndSubject(Teacher teacher, Subject subject) {

        
        List<Content> contents = contentRepository.findAllByTeacherAndSubject(teacher, subject);
        
        if (contents.isEmpty()) {
            throw new ResourceNotFoundException("No content found for subject id = " + subject.getId());
        }
        
        return contents;
    }
    
    
}
