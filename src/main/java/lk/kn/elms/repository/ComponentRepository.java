package lk.kn.elms.repository;

import lk.kn.elms.model.Component;
import lk.kn.elms.model.enums.ComponentName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComponentRepository extends JpaRepository<Component, Long> {

    Optional<Component> findByComponentNameAndType(ComponentName componentName, String type);

    List<Component> findByComponentName(ComponentName componentName);
}
