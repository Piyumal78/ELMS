package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.ComponentHandoverRequestDto;
import lk.kn.elms.dto.response.ComponentHandoverResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.ComponentHandoverService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class ComponentHandoverController {

    private ComponentHandoverService componentHandoverService;

    @PostMapping(value = "/component-handovers")
    public ResponseEntity<ComponentHandoverResponseDto> setHandoverComponent(
            @Valid @RequestBody ComponentHandoverRequestDto componentHandoverRequestDto) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        ComponentHandoverResponseDto responseDto = componentHandoverService.setHandoverComponent(componentHandoverRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PostMapping(value = "/component-handovers/{handoverId}/return")
    public ResponseEntity<ComponentHandoverResponseDto> returnHandoverComponent(
            @PathVariable Long handoverId) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        ComponentHandoverResponseDto responseDto = componentHandoverService.returnHandoverComponent(handoverId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping(value = "/component-handovers/{handoverId}")
    public ResponseEntity<ComponentHandoverResponseDto> getHandoverComponentById(
            @PathVariable Long handoverId) throws ResourceNotFoundException {
        ComponentHandoverResponseDto responseDto = componentHandoverService.getHandoverComponentById(handoverId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping(value = "/session-components/{sessionComponentId}/component-handovers")
    public ResponseEntity<List<ComponentHandoverResponseDto>> getAllHandoversBySessionComponentId(
            @PathVariable Long sessionComponentId) throws ResourceNotFoundException {
        List<ComponentHandoverResponseDto> responseDtoList = componentHandoverService.getAllHandoversBySessionComponentId(sessionComponentId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }

    @DeleteMapping(value = "/component-handovers/{handoverId}")
    public ResponseEntity<String> deleteHandoverComponent(
            @PathVariable Long handoverId) throws ResourceNotFoundException {
        componentHandoverService.deleteHandoverComponent(handoverId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Handover deleted successfully for id: " + handoverId);
    }
}
