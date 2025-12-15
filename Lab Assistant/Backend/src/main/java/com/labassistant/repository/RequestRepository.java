package com.labassistant.repository;

import com.labassistant.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    
    List<Request> findByStatus(String status);
    
    List<Request> findByStudentId(String studentId);
}

