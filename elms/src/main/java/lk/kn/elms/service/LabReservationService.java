package lk.kn.elms.service;

import lk.kn.elms.dto.request.LabReservationRequestDto;
import lk.kn.elms.dto.response.LabReservationResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.List;

public interface LabReservationService {

        LabReservationResponseDto createLabReservation(LabReservationRequestDto labReservationRequestDto)
                        throws ResourceAlreadyExistsException, ResourceNotFoundException;

        LabReservationResponseDto updateLabReservation(Long reservationId,
                        LabReservationRequestDto labReservationRequestDto)
                        throws ResourceNotFoundException, ResourceAlreadyExistsException;

        LabReservationResponseDto approveLabReservation(Long reservationId) throws ResourceNotFoundException;

        LabReservationResponseDto rejectLabReservation(Long reservationId) throws ResourceNotFoundException;

        LabReservationResponseDto cancelLabReservation(Long reservationId) throws ResourceNotFoundException;

        LabReservationResponseDto completeLabReservation(Long reservationId) throws ResourceNotFoundException;

        LabReservationResponseDto getLabReservationById(Long reservationId) throws ResourceNotFoundException;

        List<LabReservationResponseDto> getAllPendingLabReservations() throws ResourceNotFoundException;

        List<LabReservationResponseDto> getAllApprovedLabReservations() throws ResourceNotFoundException;

        List<LabReservationResponseDto> getLabReservationsByDate(LocalDate reservationDate)
                        throws ResourceNotFoundException;

        List<LabReservationResponseDto> getLabReservationsByStudentId(Long userId) throws ResourceNotFoundException;

        void deleteLabReservation(Long reservationId) throws ResourceNotFoundException;

}
