package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "lecturers")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"courses"})
@DiscriminatorValue("LECTURER")
@PrimaryKeyJoinColumn(name = "id")
public class Lecturer extends User{

    @OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL)
    private List<Course> courses;

}
