package lk.kn.elms.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import lk.kn.elms.dto.response.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
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
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(FileUploadingException.class)
    public ResponseEntity<ErrorResponseDto> handleFileUploadingException(FileUploadingException ex) {
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<ErrorResponseDto> handleJsonProcessingException(JsonProcessingException ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto("Invalid JSON format: " + ex.getOriginalMessage()),
                HttpStatus.BAD_REQUEST
        );
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

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadCredentials(BadCredentialsException ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto("Invalid username or password"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponseDto> handleDisabledUser(DisabledException ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto("User account is disabled"),
                HttpStatus.FORBIDDEN
        );
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponseDto> handleLockedUser(LockedException ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto("User account is locked"),
                HttpStatus.FORBIDDEN
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDto> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto("Authentication failed"),
                HttpStatus.UNAUTHORIZED
        );
    }

}
