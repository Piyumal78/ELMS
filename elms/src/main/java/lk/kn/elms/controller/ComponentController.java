package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.ComponentRequestDto;
import lk.kn.elms.dto.response.ComponentResponseDto;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.ComponentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class ComponentController {

    private ComponentService componentService;

    @PostMapping(value = "/components/additions")
    public ResponseEntity<ComponentResponseDto> addComponent(@Valid @RequestBody ComponentRequestDto componentRequestDto) {
        ComponentResponseDto responseDto = componentService.addComponent(componentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping(value = "/components/deductions")
    public ResponseEntity<ComponentResponseDto> deductComponent(@Valid @RequestBody ComponentRequestDto componentRequestDto)
            throws ResourceNotFoundException, ResourceInsufficientException {
        ComponentResponseDto responseDto = componentService.deductComponent(componentRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PutMapping(value = "/components")
    public ResponseEntity<ComponentResponseDto> updateComponent(@Valid @RequestBody ComponentRequestDto componentRequestDto)
            throws ResourceNotFoundException {
        ComponentResponseDto responseDto = componentService.updateComponent(componentRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping(value = "/components")
    public ResponseEntity<List<ComponentResponseDto>> getAllComponents() throws ResourceNotFoundException {
        List<ComponentResponseDto> componentResponseDtoList = componentService.getAllComponents();
        return ResponseEntity.status(HttpStatus.OK).body(componentResponseDtoList);
    }

    @GetMapping(value = "/components/name/{componentName}")
    public ResponseEntity<List<ComponentResponseDto>> getComponentByName(@PathVariable String componentName)
            throws ResourceNotFoundException {
        List<ComponentResponseDto> componentResponseDtoList = componentService.getComponentByName(componentName);
        return ResponseEntity.status(HttpStatus.OK).body(componentResponseDtoList);
    }

    @GetMapping(value = "/components/{id}")
    public ResponseEntity<ComponentResponseDto> getComponentById(@PathVariable Long id) throws ResourceNotFoundException{
        ComponentResponseDto responseDto = componentService.getComponentById(id);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @DeleteMapping(value = "/components/{id}")
    public ResponseEntity<String> deleteComponent(@PathVariable Long id) throws ResourceNotFoundException{
        componentService.deleteComponent(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Component deleted!");
    }
}
