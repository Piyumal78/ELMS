package lk.kn.elms.service.impl;

import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private CourseRepository courseRepository;


}
