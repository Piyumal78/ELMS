package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.StaffRequestDto;
import lk.kn.elms.dto.response.StaffCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Staff;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.StaffRepository;
import lk.kn.elms.service.StaffService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StaffServiceImpl implements StaffService {

    private StaffRepository staffRepository;

    @Override
    public StaffCreateResponseDto createStaff(StaffRequestDto staffRequestDto) throws ResourceAlreadyExistsException{

        if(staffRepository.existsByEmail(staffRequestDto.getEmail())) {
            throw new ResourceAlreadyExistsException("Staff with email " + staffRequestDto.getEmail() + " already exists.");
        }
        if (staffRepository.existsByPhoneNumber(staffRequestDto.getPhoneNumber())) {
            throw new ResourceAlreadyExistsException("Staff with phone number " + staffRequestDto.getPhoneNumber() + " already exists.");
        }
        if (staffRepository.existsByRegistrationNumber(staffRequestDto.getRegistrationNumber())) {
            throw new ResourceAlreadyExistsException("Staff with registration number " + staffRequestDto.getRegistrationNumber() + " already exists.");
        }

        Staff staff = new Staff();
        staff.setRegistrationNumber(staffRequestDto.getRegistrationNumber());
        staff.setName(staffRequestDto.getName());
        staff.setEmail(staffRequestDto.getEmail());
        staff.setPhoneNumber(staffRequestDto.getPhoneNumber());
        staff.setRole(UserRole.ROLE_STAFF);
        staffRepository.save(staff);

        StaffCreateResponseDto responseDto = new StaffCreateResponseDto();
        responseDto.setStaffId(staff.getId());
        responseDto.setRegistrationNumber(staff.getRegistrationNumber());
        responseDto.setName(staff.getName());
        responseDto.setEmail(staff.getEmail());
        responseDto.setPhoneNumber(staff.getPhoneNumber());
        responseDto.setCreatedDate(staff.getCreatedAt());
        responseDto.setUpdatedDate(staff.getUpdatedAt());

        return responseDto;
    }
}
