package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.LabReservationRequestDto;
import lk.kn.elms.dto.response.LabReservationResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.LabReservation;
import lk.kn.elms.model.Student;
import lk.kn.elms.model.enums.ReservationStatus;
import lk.kn.elms.repository.LabReservationRepository;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.LabReservationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class LabReservationServiceImpl implements LabReservationService {

    private LabReservationRepository labReservationRepository;
    private StudentRepository studentRepository;

    //************************************************
    //***Need to set student from security context***//
    @Override
    public LabReservationResponseDto createLabReservation(LabReservationRequestDto labReservationRequestDto)
            throws ResourceAlreadyExistsException, ResourceNotFoundException {

        List<LabReservation> overlappingReservations = labReservationRepository.findOverlappingReservations(
                labReservationRequestDto.getReservationDate(),
                labReservationRequestDto.getStartTime(),
                labReservationRequestDto.getEndTime()
        );

        if (!overlappingReservations.isEmpty()) {
            throw new ResourceAlreadyExistsException("Lab reservation conflicts with existing reservations.");
        }

        Student student = studentRepository.findById(labReservationRequestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + labReservationRequestDto.getStudentId()));

        LabReservation labReservation = new LabReservation();
        labReservation.setReservationDate(labReservationRequestDto.getReservationDate());
        labReservation.setStartTime(labReservationRequestDto.getStartTime());
        labReservation.setEndTime(labReservationRequestDto.getEndTime());
        labReservation.setPurpose(labReservationRequestDto.getPurpose());
        labReservation.setReservationStatus(ReservationStatus.PENDING);
        labReservation.setStudent(student);

        labReservationRepository.save(labReservation);

        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public LabReservationResponseDto updateLabReservation(Long reservationId, LabReservationRequestDto labReservationRequestDto)
            throws ResourceNotFoundException, ResourceAlreadyExistsException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        List<LabReservation> overlappingReservations = labReservationRepository.findOverlappingReservations(
                labReservationRequestDto.getReservationDate(),
                labReservationRequestDto.getStartTime(),
                labReservationRequestDto.getEndTime()
        );

        if (!overlappingReservations.isEmpty()) {
            throw new ResourceAlreadyExistsException("Lab reservation conflicts with existing reservations.");
        }

        labReservation.setReservationDate(labReservationRequestDto.getReservationDate());
        labReservation.setStartTime(labReservationRequestDto.getStartTime());
        labReservation.setEndTime(labReservationRequestDto.getEndTime());
        labReservation.setPurpose(labReservationRequestDto.getPurpose());

        labReservationRepository.save(labReservation);
        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public LabReservationResponseDto approveLabReservation(Long reservationId) throws ResourceNotFoundException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        labReservation.setReservationStatus(ReservationStatus.APPROVED);
        labReservationRepository.save(labReservation);

        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public LabReservationResponseDto rejectLabReservation(Long reservationId) throws ResourceNotFoundException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        labReservation.setReservationStatus(ReservationStatus.REJECTED);
        labReservationRepository.save(labReservation);

        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public LabReservationResponseDto cancelLabReservation(Long reservationId) throws ResourceNotFoundException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        labReservation.setReservationStatus(ReservationStatus.CANCELLED);
        labReservationRepository.save(labReservation);

        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public LabReservationResponseDto completeLabReservation(Long reservationId) throws ResourceNotFoundException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        labReservation.setReservationStatus(ReservationStatus.COMPLETED);
        labReservationRepository.save(labReservation);

        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public LabReservationResponseDto getLabReservationById(Long reservationId) throws ResourceNotFoundException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        return mapEntityToResponseDto(labReservation);
    }

    @Override
    public List<LabReservationResponseDto> getAllPendingLabReservations() throws ResourceNotFoundException {

        List<LabReservation> pendingReservations = labReservationRepository.findAllPendingReservations();

        if (pendingReservations.isEmpty()) {
            throw new ResourceNotFoundException("No pending lab reservations found.");
        }

        return mapEntityListToDtoList(pendingReservations);
    }

    @Override
    public List<LabReservationResponseDto> getAllApprovedLabReservations() throws ResourceNotFoundException {

        List<LabReservation> approvedReservations = labReservationRepository.findAllApprovedReservations();

        if (approvedReservations.isEmpty()) {
            throw new ResourceNotFoundException("No approved lab reservations found.");
        }

        return mapEntityListToDtoList(approvedReservations);
    }

    @Override
    public List<LabReservationResponseDto> getLabReservationsByDate(LocalDate reservationDate) throws ResourceNotFoundException {

        List<LabReservation> reservationsByDate = labReservationRepository.findAllByReservationDate(reservationDate);

        if (reservationsByDate.isEmpty()) {
            throw new ResourceNotFoundException("No lab reservations found for date: " + reservationDate);
        }

        return mapEntityListToDtoList(reservationsByDate);
    }

    @Override
    public void deleteLabReservation(Long reservationId) throws ResourceNotFoundException {

        LabReservation labReservation = labReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab reservation not found with ID: " + reservationId));

        labReservationRepository.delete(labReservation);
    }

    private LabReservationResponseDto mapEntityToResponseDto(LabReservation labReservation) {
        LabReservationResponseDto responseDto = new LabReservationResponseDto();
        responseDto.setReservationId(labReservation.getId());
        responseDto.setReservationDate(labReservation.getReservationDate());
        responseDto.setStartTime(labReservation.getStartTime());
        responseDto.setEndTime(labReservation.getEndTime());
        responseDto.setPurpose(labReservation.getPurpose());
        responseDto.setReservationStatus(labReservation.getReservationStatus().name());
        responseDto.setStudentId(labReservation.getStudent().getId());
        responseDto.setCreatedAt(labReservation.getCreatedAt());
        responseDto.setUpdatedAt(labReservation.getUpdatedAt());
        return responseDto;
    }

    private List<LabReservationResponseDto> mapEntityListToDtoList(List<LabReservation> labReservations) {

        List<LabReservationResponseDto> dtoList = new ArrayList<>();
        for (LabReservation labReservation : labReservations) {
            LabReservationResponseDto dto = mapEntityToResponseDto(labReservation);
            dtoList.add(dto);
    }
        return dtoList;
    }
}
