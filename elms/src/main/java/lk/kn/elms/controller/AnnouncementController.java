package lk.kn.elms.controller;

import lk.kn.elms.dto.request.AnnouncementRequestDto;
import lk.kn.elms.dto.response.AnnouncementResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.AnnouncementService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
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

    @PostMapping(value = "/announcements")
    public ResponseEntity<AnnouncementResponseDto> createAnnouncement(@RequestBody AnnouncementRequestDto announcementRequestDto)
            throws ResourceNotFoundException {

        AnnouncementResponseDto responseDto = announcementService.createAnnouncement(announcementRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping(value = "/courses/{courseId}/announcements")
    public ResponseEntity<List<AnnouncementResponseDto>> getAllAnnouncementsByCourseId(
            @PathVariable Long courseId) throws ResourceNotFoundException{

        List<AnnouncementResponseDto> announcementResponseDtoList = announcementService.getAllAnnouncementsByCourseId(courseId);
        return ResponseEntity.status(HttpStatus.OK).body(announcementResponseDtoList);
    }

    @GetMapping(value = "/announcements/{id}")
    public ResponseEntity<AnnouncementResponseDto> getAnnouncementsById(@PathVariable Long id)
            throws ResourceNotFoundException{

        AnnouncementResponseDto responseDto = announcementService.getAnnounceById(id);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PutMapping(value = "/announcements/{id}")
    public ResponseEntity<AnnouncementResponseDto> updateAnnouncements(
            @PathVariable Long id, @RequestBody AnnouncementRequestDto announcementRequestDto) throws ResourceNotFoundException{

        AnnouncementResponseDto responseDto = announcementService.updateAnnouncement(id,announcementRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @DeleteMapping(value = "announcements/{id}")
    public ResponseEntity<String> deleteAnnouncements(@PathVariable Long id) throws ResourceNotFoundException{

        announcementService.deleteAnnouncement(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Announcement deleted successfully!");
    }

}
