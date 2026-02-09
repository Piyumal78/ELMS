package lk.kn.elms.config;

import lk.kn.elms.model.Course;
import lk.kn.elms.model.Lecturer;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.repository.LecturerRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final LecturerRepository lecturerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedLecturerAndCourse();
    }

    private void seedLecturerAndCourse() {
        // 1. Check if Lecturer exists, if not create one
        String defaultLecturerEmail = "lecturer@elms.com";
        Lecturer lecturer = lecturerRepository.findByEmail(defaultLecturerEmail).orElse(null);

        if (lecturer == null) {
            lecturer = new Lecturer();
            lecturer.setName("Default Lecturer");
            lecturer.setEmail(defaultLecturerEmail);
            lecturer.setPassword(passwordEncoder.encode("password"));
            lecturer.setRole(UserRole.ROLE_LECTURER);
            lecturer.setRegistrationNumber("LEC001");
            lecturer.setCreatedAt(LocalDateTime.now());
            lecturer.setUpdatedAt(LocalDateTime.now());
            lecturer = lecturerRepository.save(lecturer);
            System.out.println("Seeded Default Lecturer: " + lecturer.getEmail());
        }

        // 2. Check if Course EE101 exists, if not create it
        String courseCode = "EE101";
        if (!courseRepository.existsByCourseCode(courseCode)) {
            Course course = new Course();
            course.setCourseCode(courseCode);
            course.setCourseName("Intro to Electronics");
            course.setAcademicYear("2024/2025");
            course.setLecturer(lecturer);
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course);
            System.out.println("Seeded Course: " + courseCode);
        }
    }
}
