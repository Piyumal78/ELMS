package lk.kn.elms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.AnnouncementRequestDto;
import lk.kn.elms.dto.response.AnnouncementResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.AnnouncementService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class AnnouncementController {

    private AnnouncementService announcementService;

    @Operation(summary = "Create announcements", description = "Create an announcement by a lecturer or a demonstrator")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Announcement created successfully")
    })
    @RolesAllowed({"LECTURER","DEMONSTRATOR"})
    @PostMapping(value = "/announcements")
    public ResponseEntity<AnnouncementResponseDto> createAnnouncement(@Valid @RequestBody AnnouncementRequestDto announcementRequestDto)
            throws ResourceNotFoundException {

        AnnouncementResponseDto responseDto = announcementService.createAnnouncement(announcementRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }


    @Operation(summary = "Get Announcements by course id", description = "Get all announcements of given course")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Announcements returned successfully")
    })
    @RolesAllowed({"LECTURER","DEMONSTRATOR","STUDENT"})
    @GetMapping(value = "/courses/{courseId}/announcements")
    public ResponseEntity<List<AnnouncementResponseDto>> getAllAnnouncementsByCourseId(
            @PathVariable Long courseId) throws ResourceNotFoundException{

        List<AnnouncementResponseDto> announcementResponseDtoList = announcementService.getAllAnnouncementsByCourseId(courseId);
        return ResponseEntity.status(HttpStatus.OK).body(announcementResponseDtoList);
    }


    @Operation(summary = "Get announcement by id", description = "Get specific announcement by its id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Announcements returned successfully")
    })
    @RolesAllowed({"LECTURER","DEMONSTRATOR","STUDENT"})
    @GetMapping(value = "/announcements/{id}")
    public ResponseEntity<AnnouncementResponseDto> getAnnouncementsById(@PathVariable Long id)
            throws ResourceNotFoundException{

        AnnouncementResponseDto responseDto = announcementService.getAnnounceById(id);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }


    @Operation(summary = "Update announcement", description = "Update an announcement by a lecturer or demonstrator")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Announcement updated successfully")
    })
    @RolesAllowed({"LECTURER","DEMONSTRATOR"})
    @PutMapping(value = "/announcements/{id}")
    public ResponseEntity<AnnouncementResponseDto> updateAnnouncements(
            @PathVariable Long id, @RequestBody AnnouncementRequestDto announcementRequestDto) throws ResourceNotFoundException{

        AnnouncementResponseDto responseDto = announcementService.updateAnnouncement(id,announcementRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }


    @Operation(summary = "Delete announcement", description = "Delete an announcement by its id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Announcement deleted successfully")
    })
    @RolesAllowed({"LECTURER","DEMONSTRATOR"})
    @DeleteMapping(value = "announcements/{id}")
    public ResponseEntity<String> deleteAnnouncements(@PathVariable Long id) throws ResourceNotFoundException{

        announcementService.deleteAnnouncement(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Announcement deleted successfully!");
    }

}
