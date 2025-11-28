package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "demonstrators")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"labReportReviews"})
@DiscriminatorValue("DEMONSTRATOR")
@PrimaryKeyJoinColumn(name = "id")
public class Demonstrator extends User {

    @OneToMany(mappedBy = "demonstrator", cascade = CascadeType.ALL)
    private List<LabReportReview> labReportReviews;
}
