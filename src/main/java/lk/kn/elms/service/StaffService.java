package lk.kn.elms.service;

import lk.kn.elms.dto.request.StaffRequestDto;
import lk.kn.elms.dto.response.StaffCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;

public interface StaffService {

    StaffCreateResponseDto createStaff(StaffRequestDto staffRequestDto) throws ResourceAlreadyExistsException;
}
