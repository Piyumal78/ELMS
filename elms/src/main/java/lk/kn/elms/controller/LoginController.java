package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.AuthRequestDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.LoginService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lk.kn.elms.model.User;
import lk.kn.elms.dto.response.UserResponseDto;

import java.util.Map;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class LoginController {

    private final LoginService loginService;

    @PostMapping(value = "/auth/activate")
    public ResponseEntity<String> signUp(@Valid @RequestBody AuthRequestDto authRequestDto)
            throws ResourceNotFoundException, ResourceAlreadyExistsException {
        loginService.activateAccount(authRequestDto.getUsername(), authRequestDto.getPassword());
        return ResponseEntity.status(HttpStatus.OK).body("Sign up successful");
    }

    @PostMapping(value = "/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthRequestDto authRequestDto) {
        Map<String, String> loginResponse = loginService.login(authRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
    }

}
