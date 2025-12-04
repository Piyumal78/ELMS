package lk.kn.elms.exception;

import lk.kn.elms.dto.response.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class AppControllerAdviser {

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceAlreadyExists(ResourceAlreadyExistsException ex) {
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceInsufficientException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceInsufficientException(ResourceInsufficientException ex){
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.INSUFFICIENT_STORAGE);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return new ResponseEntity<>(new ErrorResponseDto(errorMessage), HttpStatus.BAD_REQUEST);
    }
}
