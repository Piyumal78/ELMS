package lk.kn.elms.repository;

import lk.kn.elms.model.ComponentHandover;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComponentHandoverRepository extends JpaRepository<ComponentHandover, Long> {

    List<ComponentHandover> findAllBySessionComponentId(Long sessionComponentId);
}
