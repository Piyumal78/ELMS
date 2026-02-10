package lk.kn.elms.repository;

import lk.kn.elms.model.Demonstrator;
import lk.kn.elms.model.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LecturerRepository extends JpaRepository<Lecturer, Long> {

    boolean existsByRegistrationNumber(String registrationNumber);

    boolean existsByEmail(String email);

    Optional<Lecturer> findByRegistrationNumber(String registrationNumber);

    Optional<Lecturer> findByEmail(String email);
}
