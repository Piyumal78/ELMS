package lk.kn.elms.security;

import lk.kn.elms.model.User;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@AllArgsConstructor
public class AppUserDetailService implements UserDetailsService {

    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String registrationNumber) throws UsernameNotFoundException {

        User user = userRepository.findByRegistrationNumber(registrationNumber).orElseThrow(
                () -> new UsernameNotFoundException("No user found with registration number  [" + registrationNumber  + "]")
        );

        UserRole userRole = user.getRole();

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getRegistrationNumber())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority(userRole.toString()))
                .build();
    }
}
