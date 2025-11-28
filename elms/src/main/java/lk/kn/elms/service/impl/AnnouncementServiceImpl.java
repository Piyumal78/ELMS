package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.AnnouncementRequestDto;
import lk.kn.elms.dto.response.AnnouncementResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Announcement;
import lk.kn.elms.model.Course;
import lk.kn.elms.model.User;
import lk.kn.elms.repository.AnnouncementRepository;
import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.repository.UserRepository;
import lk.kn.elms.service.AnnouncementService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    //**************************************************
    //Should get the user by security context
    @Override
    public AnnouncementResponseDto createAnnouncement(AnnouncementRequestDto announcementRequestDto) throws ResourceNotFoundException {

        User announcer = userRepository.findById(announcementRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + announcementRequestDto.getUserId()));

        Course course = courseRepository.findById(announcementRequestDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + announcementRequestDto.getCourseId()));

        Announcement announcement = new Announcement();
        announcement.setContent(announcementRequestDto.getContent());
        announcement.setCourse(course);
        announcement.setUser(announcer);
        announcementRepository.save(announcement);

        return mapEntityToResponseDto(announcement);

    }

    @Override
    public List<AnnouncementResponseDto> getAllAnnouncementsByCourseId(Long courseId) throws ResourceNotFoundException {

        if(!announcementRepository.existsByCourseId(courseId)){
            throw new ResourceNotFoundException("There are no announcements for this course!");
        }

        List<Announcement> announcements = announcementRepository.findByCourseId(courseId);

        return mapEntityListToResponseDtoList(announcements);
    }

    @Override
    public AnnouncementResponseDto getAnnounceById(Long id) throws ResourceNotFoundException {

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("There is no announcement with id = "+ id));

        return mapEntityToResponseDto(announcement);
    }

    @Override
    public AnnouncementResponseDto updateAnnouncement(Long id, AnnouncementRequestDto announcementRequestDto) throws ResourceNotFoundException {

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("There is no announcement with id = "+ id));

        Course course = courseRepository.findById(announcementRequestDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + announcementRequestDto.getCourseId()));

        announcement.setContent(announcementRequestDto.getContent());
        announcement.setCourse(course);
        announcementRepository.save(announcement);

        return mapEntityToResponseDto(announcement);

    }

    @Override
    public void deleteAnnouncement(Long id) throws ResourceNotFoundException {

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("There is no announcement with is = "+ id));

        announcementRepository.delete(announcement);

    }

    private AnnouncementResponseDto mapEntityToResponseDto(Announcement announcement) {
        AnnouncementResponseDto responseDto = new AnnouncementResponseDto();
        responseDto.setId(announcement.getId());
        responseDto.setContent(announcement.getContent());
        responseDto.setCourseCode(announcement.getCourse().getCourseCode());
        responseDto.setCourseTitle(announcement.getCourse().getCourseName());
        responseDto.setAnnouncerName(announcement.getUser().getName());
        responseDto.setCreatedAt(announcement.getCreatedAt());
        responseDto.setUpdatedAt(announcement.getUpdatedAt());
        return responseDto;
    }

    private List<AnnouncementResponseDto> mapEntityListToResponseDtoList(List<Announcement> announcements){

        List<AnnouncementResponseDto> announcementResponseDtoList = new ArrayList<>();
        for (Announcement announcement : announcements){

            AnnouncementResponseDto responseDto = new AnnouncementResponseDto();
            responseDto.setId(announcement.getId());
            responseDto.setContent(announcement.getContent());
            responseDto.setCourseCode(announcement.getCourse().getCourseCode());
            responseDto.setCourseTitle(announcement.getCourse().getCourseName());
            responseDto.setAnnouncerName(announcement.getUser().getName());
            responseDto.setCreatedAt(announcement.getCreatedAt());
            responseDto.setUpdatedAt(announcement.getUpdatedAt());
            announcementResponseDtoList.add(responseDto);
        }
        return announcementResponseDtoList;
    }

}
