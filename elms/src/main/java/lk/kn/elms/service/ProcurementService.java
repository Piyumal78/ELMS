package lk.kn.elms.service;

import lk.kn.elms.model.Procurement;
import lk.kn.elms.model.Inventory;
import lk.kn.elms.repository.ProcurementRepository;
import lk.kn.elms.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProcurementService {

    @Autowired
    private ProcurementRepository procurementRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Procurement> getAllRequests() {
        return procurementRepository.findAll();
    }

    public Optional<Procurement> getRequestById(Long id) {
        return procurementRepository.findById(Objects.requireNonNull(id, "ID cannot be null"));
    }

    @Transactional
    public Procurement createRequest(Procurement procurement) {
        // Ensure ID is null to force creation of a new entity
        procurement.setId(null);
        Procurement saved = procurementRepository
                .save(Objects.requireNonNull(procurement, "Procurement cannot be null"));

        // Notify Lab Assistant (though typically they create it, maybe notify Admin?)
        // For now, let's notify LAB_ASSISTANT just so it shows up in their feed as a
        // record
        notificationService.createNotification(
                "Request for " + saved.getQuantity() + "x " + saved.getItemName() + " created.",
                "LAB_ASSISTANT");
        return saved;
    }

    public List<Procurement> getRequestsByStatus(String status) {
        return procurementRepository.findByStatus(status);
    }

    @Transactional
    public Procurement approveRequest(Long id) {
        Procurement procurement = procurementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procurement request not found with id: " + id));

        System.out.println("Approving request ID: " + id);
        if (procurement.getStatus() != null && !"Pending".equalsIgnoreCase(procurement.getStatus().trim())) {
            System.out.println("Failed approval. Current status: " + procurement.getStatus());
            throw new RuntimeException(
                    "Only pending requests can be approved. Current status: " + procurement.getStatus());
        }

        procurement.setStatus("Approved");
        return procurementRepository.save(procurement);
    }

    @Transactional
    public Procurement rejectRequest(Long id) {
        Procurement procurement = procurementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procurement request not found with id: " + id));

        if (!"Pending".equalsIgnoreCase(procurement.getStatus())) {
            throw new RuntimeException("Only pending requests can be rejected.");
        }

        procurement.setStatus("Rejected");
        return procurementRepository.save(procurement);
    }

    @Transactional
    public Procurement receiveRequest(Long id) {
        Procurement procurement = procurementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Procurement request not found with id: " + id));

        if (!"Approved".equalsIgnoreCase(procurement.getStatus())) {
            throw new RuntimeException("Only approved requests can be marked as received.");
        }

        // Update Inventory
        Optional<Inventory> existingItem = inventoryRepository.findAll().stream()
                .filter(item -> item.getName().equalsIgnoreCase(procurement.getItemName()))
                .findFirst();

        if (existingItem.isPresent()) {
            Inventory inventory = existingItem.get();
            inventory.setQuantity(inventory.getQuantity() + procurement.getQuantity());
            inventoryRepository.save(inventory);
        } else {
            Inventory newInventory = new Inventory();
            newInventory.setName(procurement.getItemName());
            newInventory.setQuantity(procurement.getQuantity());
            newInventory.setCategory("Other"); // Default
            newInventory.setMinimumStock(5); // Default
            newInventory.setStatus("Available");
            newInventory.setDescription("Automatically added from procurement");
            inventoryRepository.save(newInventory);
        }

        procurement.setStatus("Received");
        procurement.setDeliveryDate(LocalDate.now());
        Procurement saved = procurementRepository.save(procurement);

        notificationService.createNotification(
                procurement.getQuantity() + "x " + procurement.getItemName() + " has been added to inventory.",
                "LAB_ASSISTANT");

        return saved;
    }
}
