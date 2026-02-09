package lk.kn.elms;

import lk.kn.elms.model.Admin;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public void run(String... args) throws Exception {

        if (userRepository.findByRole(UserRole.ROLE_ADMIN).isEmpty()){
            Admin admin = new Admin();
            admin.setRegistrationNumber("AD-2021-01");
            admin.setName("Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ROLE_ADMIN);
            userRepository.save(admin);
        }
    }
}
