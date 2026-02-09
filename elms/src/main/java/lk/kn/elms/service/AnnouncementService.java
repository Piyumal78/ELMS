package lk.kn.elms.service;

import lk.kn.elms.dto.request.AnnouncementRequestDto;
import lk.kn.elms.dto.response.AnnouncementResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface AnnouncementService {

    AnnouncementResponseDto createAnnouncement(AnnouncementRequestDto announcementRequestDto) throws ResourceNotFoundException;

    List<AnnouncementResponseDto> getAllAnnouncementsByCourseId(Long courseId) throws ResourceNotFoundException;

    AnnouncementResponseDto getAnnounceById (Long id) throws ResourceNotFoundException;

    AnnouncementResponseDto updateAnnouncement(Long id, AnnouncementRequestDto announcementRequestDto) throws ResourceNotFoundException;

    void deleteAnnouncement (Long id) throws ResourceNotFoundException;

    List<AnnouncementResponseDto> getAllAnnouncementsByCourseCode(String courseCode) throws ResourceNotFoundException;
}
