package lk.kn.elms.service;

import lk.kn.elms.dto.RequestDTO;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.model.Inventory;
import lk.kn.elms.model.Request;
import lk.kn.elms.repository.InventoryRepository;
import lk.kn.elms.repository.RequestRepository;
import lk.kn.elms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private lk.kn.elms.repository.EquipmentRepository equipmentRepository;

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    @Transactional
    public Request createRequest(RequestDTO dto) throws ResourceInsufficientException {
        // 1. Check if item exists in Inventory
        Inventory inventory = inventoryRepository.findByName(dto.getItemName())
                .orElseThrow(() -> new RuntimeException("Item not found: " + dto.getItemName()));

        // 2. Validation: Check quantity
        if (inventory.getQuantity() < dto.getQuantity()) {
            throw new ResourceInsufficientException("Insufficient stock. Available: " + inventory.getQuantity());
        }

        // 3. Mapping: Manual map ALL fields
        Request request = new Request();
        request.setStudentId(dto.getStudentId()); // Set String Reg No

        // Look up User to get Numeric ID (for DB constraint) and Name (if missing)
        lk.kn.elms.model.User user = userRepository.findByRegistrationNumber(dto.getStudentId())
                .orElse(null);

        if (user != null) {
            request.setUserId(user.getId()); // Satisfy FK
        }

        // Handle studentName
        String studentName = dto.getStudentName();
        if (studentName == null || studentName.trim().isEmpty()) {
            studentName = (user != null) ? user.getName() : "Unknown Student";
        }
        request.setStudentName(studentName);

        request.setItemName(dto.getItemName());
        request.setInventoryId(inventory.getId()); // Set ID to satisfy DB foreign key
        request.setQuantity(dto.getQuantity());
        request.setPurpose(dto.getPurpose());

        // 4. Auto-set Fields
        request.setRequestDate(LocalDate.now());
        request.setStatus("PENDING");

        // 5. Save (Do NOT deduct stock yet)
        return requestRepository.save(request);
    }

    @Transactional
    public Request approveRequest(Long requestId) throws ResourceInsufficientException {
        // Fetch Request
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Request is not in PENDING state");
        }

        // Fetch Inventory (by name from request)
        Inventory inventory = inventoryRepository.findByName(request.getItemName())
                .orElse(null);

        // Check if item exists in inventory
        if (inventory == null) {
            // Auto-reject if item not found
            request.setStatus("REJECTED");
            requestRepository.save(request);
            throw new ResourceInsufficientException(
                    "Item not available in inventory: " + request.getItemName());
        }

        // Check if sufficient quantity available
        if (inventory.getQuantity() < request.getQuantity()) {
            // Auto-reject if insufficient stock
            request.setStatus("REJECTED");
            requestRepository.save(request);
            throw new ResourceInsufficientException(
                    "Insufficient stock. Available: " + inventory.getQuantity() +
                            ", Requested: " + request.getQuantity());
        }

        // If validation passes, approve WITHOUT deducting stock
        // Stock will be deducted when item is ISSUED
        request.setStatus("APPROVED");
        return requestRepository.save(request);
    }

    @Transactional
    public Request rejectRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("REJECTED");
        return requestRepository.save(request);
    }

    @Transactional
    public Request issueRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"APPROVED".equals(request.getStatus())) {
            throw new RuntimeException("Request must be APPROVED before issuing");
        }

        // Deduct stock from inventory when issuing
        Inventory inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        // Final validation before deducting (in case stock changed between approval and
        // issue)
        if (inventory.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock at issue time. Available: " +
                    inventory.getQuantity() + ", Requested: " + request.getQuantity());
        }

        // Deduct stock
        inventory.setQuantity(inventory.getQuantity() - request.getQuantity());
        inventoryRepository.save(inventory);

        // Update request status
        request.setStatus("ISSUED");
        return requestRepository.save(request);
    }

    @Transactional
    public Request returnRequest(Long requestId, Boolean isDamaged) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"ISSUED".equals(request.getStatus())) {
            throw new RuntimeException("Request must be ISSUED before returning");
        }

        // Return stock
        Inventory inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        // Handle damaged vs good condition returns
        if (isDamaged != null && isDamaged) {
            // Item is damaged - create equipment maintenance entry
            lk.kn.elms.model.Equipment equipment = new lk.kn.elms.model.Equipment();
            equipment.setName(inventory.getName());
            equipment.setStatus("Damaged");
            equipment.setLocation("Lab - Awaiting Repair");
            equipment.setLastMaintenanceDate(java.time.LocalDate.now());
            equipment.setSerialNumber("REQ-" + requestId);
            equipmentRepository.save(equipment);

            // Do NOT return damaged items to available stock
        } else {
            // Item is in good condition - return to inventory stock
            inventory.setQuantity(inventory.getQuantity() + request.getQuantity());
            inventoryRepository.save(inventory);
        }

        request.setStatus("RETURNED");
        return requestRepository.save(request);
    }
}
