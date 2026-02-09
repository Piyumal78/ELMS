package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.AuthRequestDto;
import lk.kn.elms.dto.response.UserResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.User;
import lk.kn.elms.repository.UserRepository;
import lk.kn.elms.security.JwtUtil;
import lk.kn.elms.service.LoginService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;

@Service
@AllArgsConstructor
public class LoginServiceImpl implements LoginService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtil;


    @Override
    public void activateAccount(String username, String password)
            throws ResourceNotFoundException, ResourceAlreadyExistsException {

        if (userRepository.existsByRegistrationNumberAndPasswordIsNotNull(username)) {
            throw new ResourceAlreadyExistsException("User has already signed up");
        }

        User user = userRepository.findByRegistrationNumber(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username " + username));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    @Override
    public Map<String, String> login(AuthRequestDto authRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDto.getUsername(), authRequestDto.getPassword()));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(authRequestDto.getUsername(),
                "", authentication.getAuthorities());
        String token = jwtUtil.generateToken(userDetails);

        return Collections.singletonMap("token", token);
    }

    @Override
    public UserResponseDto getCurrentUserProfile(String registrationNumber) throws ResourceNotFoundException {
        User user = userRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getId());
        dto.setRegistrationNumber(user.getRegistrationNumber());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }

}
