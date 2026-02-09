package lk.kn.elms.service;

import lk.kn.elms.dto.request.AuthRequestDto;
import lk.kn.elms.dto.response.UserResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.User;

import java.util.Map;

public interface LoginService {

    void activateAccount(String username, String password) throws ResourceNotFoundException, ResourceAlreadyExistsException;

    Map<String, String> login(AuthRequestDto authRequestDto);

    UserResponseDto getCurrentUserProfile(String registrationNumber) throws ResourceNotFoundException;
}
