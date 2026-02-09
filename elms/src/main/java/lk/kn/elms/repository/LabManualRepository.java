package lk.kn.elms.repository;

import lk.kn.elms.model.LabManual;

import java.security.cert.PKIXRevocationChecker.Option;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LabManualRepository extends JpaRepository<LabManual, Long> {

    boolean existsBySessionId(Long sessionId);
    Optional<LabManual> findBySessionId(Long sessionId);
}
