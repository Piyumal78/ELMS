package lk.kn.elms.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AcademicYearValidator.class)
public @interface ValidAcademicYear {

    String message() default "Invalid academic year. The second year must be the first year + 1";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
