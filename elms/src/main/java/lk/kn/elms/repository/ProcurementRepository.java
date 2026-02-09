package lk.kn.elms.repository;

import lk.kn.elms.model.Procurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcurementRepository extends JpaRepository<Procurement, Long> {

    List<Procurement> findByStatus(String status);
}
