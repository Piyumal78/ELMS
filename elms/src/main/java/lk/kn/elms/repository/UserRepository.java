package lk.kn.elms.repository;

import lk.kn.elms.model.User;
import lk.kn.elms.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

     boolean existsByRegistrationNumberAndPasswordIsNotNull(String registrationNumber);

     Optional<User> findByRegistrationNumber(String registrationNumber);

     List<User> findByRole(UserRole role);
}
