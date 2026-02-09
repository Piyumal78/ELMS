package lk.kn.elms.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AcademicYearValidator implements ConstraintValidator<ValidAcademicYear, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || !value.matches("^20\\d{2}/20\\d{2}$")) {
            return false;
        }

        String[] parts = value.split("/");
        int year1 = Integer.parseInt(parts[0]);
        int year2 = Integer.parseInt(parts[1]);

        return year2 == year1 + 1;
    }
}
