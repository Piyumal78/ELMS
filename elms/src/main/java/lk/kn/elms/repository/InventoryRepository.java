package lk.kn.elms.repository;

import lk.kn.elms.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByStatus(String status);

    List<Inventory> findByCategory(String category);

    java.util.Optional<Inventory> findByName(String name);

    // Find items with low stock (quantity < minimumStock)
    List<Inventory> findByQuantityLessThan(Integer quantity);

    @Query("SELECT count(i) FROM Inventory i WHERE i.quantity < i.minimumStock")
    long countLowStock();

    @Query("SELECT i FROM Inventory i WHERE i.quantity < i.minimumStock")
    List<Inventory> findItemsWithLowStock();

    // Find items by multiple statuses (e.g. Damaged, Under Maintenance)
    List<Inventory> findByStatusIn(List<String> statuses);
}
