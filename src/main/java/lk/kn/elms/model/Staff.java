package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "staff")
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("STAFF")
@PrimaryKeyJoinColumn(name = "id")
public class Staff extends User{

    @Column(name = "phone_number")
    private String phoneNumber;
}
