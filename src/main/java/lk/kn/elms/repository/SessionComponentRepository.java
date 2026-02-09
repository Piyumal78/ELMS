package lk.kn.elms.repository;

import lk.kn.elms.model.SessionComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionComponentRepository extends JpaRepository<SessionComponent, Long> {

    Optional<SessionComponent> findBySessionId(Long sessionId);

    boolean existsBySessionId(Long sessionId);
}
