package lk.kn.elms.repository;

import lk.kn.elms.model.Demonstrator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DemonstratorRepository extends JpaRepository<Demonstrator, Long> {

    boolean existsByRegistrationNumber(String registrationNumber);

    boolean existsByEmail(String email);

    Optional<Demonstrator> findByRegistrationNumber(String registrationNumber);



}
