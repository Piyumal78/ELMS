package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.SessionComponentItemRequestDto;
import lk.kn.elms.dto.request.SessionComponentRequestDto;
import lk.kn.elms.dto.response.SessionComponentItemResponseDto;
import lk.kn.elms.dto.response.SessionComponentResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Component;
import lk.kn.elms.model.Session;
import lk.kn.elms.model.SessionComponent;
import lk.kn.elms.model.SessionComponentItem;
import lk.kn.elms.repository.ComponentRepository;
import lk.kn.elms.repository.SessionComponentRepository;
import lk.kn.elms.repository.SessionRepository;
import lk.kn.elms.service.SessionComponentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class SessionComponentServiceImpl implements SessionComponentService {

    private final ComponentRepository componentRepository;
    private SessionComponentRepository sessionComponentRepository;
    private SessionRepository sessionRepository;

    @Override
    public SessionComponentResponseDto createSessionComponent(Long sessionId, SessionComponentRequestDto sessionComponentRequestDto)
            throws ResourceNotFoundException, ResourceInsufficientException, ResourceAlreadyExistsException {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        if (sessionComponentRepository.existsBySessionId(sessionId)) {
            throw new ResourceAlreadyExistsException("Session component already exists with session id: " + sessionId);
        }

        List <SessionComponentItem> sessionComponentItems = new ArrayList<>();
        for(SessionComponentItemRequestDto sessionComponentItemRequestDto : sessionComponentRequestDto.getSessionComponentItems()){
            SessionComponentItem sessionComponentItem = new SessionComponentItem();

            Component component = componentRepository.findById(sessionComponentItemRequestDto.getComponentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Component not found with id: " + sessionComponentItemRequestDto.getComponentId()));

            Integer requiredQuantity = sessionComponentItemRequestDto.getQuantity() * sessionComponentRequestDto.getAmount();
            Integer existingQuantity = component.getQuantity();

            if (existingQuantity < requiredQuantity) {
                throw new ResourceInsufficientException("Insufficient quantity of " +component.getComponentName());
            }
            sessionComponentItem.setQuantity(sessionComponentItemRequestDto.getQuantity());
            sessionComponentItem.setComponent(component);
            sessionComponentItems.add(sessionComponentItem);
        }

        SessionComponent sessionComponent = new SessionComponent();
        sessionComponent.setSession(session);
        sessionComponent.setAmount(sessionComponentRequestDto.getAmount());
        sessionComponent.setSessionComponentItems(sessionComponentItems);

        for(SessionComponentItem sessionComponentItem : sessionComponentItems){
            sessionComponentItem.setSessionComponent(sessionComponent);
        }
        sessionComponentRepository.save(sessionComponent);

        return mapEntityToResponseDto(sessionComponent);

    }

    @Override
    public SessionComponentResponseDto updateSessionComponent(Long sessionId, SessionComponentRequestDto sessionComponentRequestDto) throws ResourceNotFoundException {

        SessionComponent sessionComponent = sessionComponentRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("SessionComponent not found for session id: " + sessionId));

        List <SessionComponentItem> sessionComponentItems = new ArrayList<>();
        for(SessionComponentItemRequestDto sessionComponentItemRequestDto : sessionComponentRequestDto.getSessionComponentItems()){
            SessionComponentItem sessionComponentItem = new SessionComponentItem();

            Component component = componentRepository.findById(sessionComponentItemRequestDto.getComponentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Component not found with id: " + sessionComponentItemRequestDto.getComponentId()));
            sessionComponentItem.setComponent(component);
            sessionComponentItem.setQuantity(sessionComponentItemRequestDto.getQuantity());
            sessionComponentItems.add(sessionComponentItem);
        }

        sessionComponent.setSessionComponentItems(sessionComponentItems);
        sessionComponentRepository.save(sessionComponent);

        return mapEntityToResponseDto(sessionComponent);

    }

    @Override
    public SessionComponentResponseDto getSessionComponentBySessionId(Long sessionId) throws ResourceNotFoundException {

        SessionComponent sessionComponent = sessionComponentRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("SessionComponent not found for session id: " + sessionId));

        return mapEntityToResponseDto(sessionComponent);
    }

    @Override
    public List<SessionComponentResponseDto> getAllSessionComponents() throws ResourceNotFoundException {

        List<SessionComponent> sessionComponents = sessionComponentRepository.findAll();

        if (sessionComponents.isEmpty()){
            throw new ResourceNotFoundException("No session components found!");
        }

        List<SessionComponentResponseDto> sessionComponentResponseDtoList = new ArrayList<>();
        for(SessionComponent sessionComponent : sessionComponents){

            SessionComponentResponseDto dto = mapEntityToResponseDto(sessionComponent);
            sessionComponentResponseDtoList.add(dto);
        }

        return sessionComponentResponseDtoList;
    }

    @Override
    public void deleteSessionComponent(Long sessionId) throws ResourceNotFoundException {

        SessionComponent sessionComponent = sessionComponentRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("SessionComponent not found for session id: " + sessionId));

        sessionComponentRepository.delete(sessionComponent);

    }

    private SessionComponentResponseDto mapEntityToResponseDto(SessionComponent sessionComponent){

        List<SessionComponentItemResponseDto> sessionComponentItemResponseDtoList = new ArrayList<>();
        for(SessionComponentItem sessionComponentItem : sessionComponent.getSessionComponentItems()){
            SessionComponentItemResponseDto itemResponseDto = new SessionComponentItemResponseDto();
            itemResponseDto.setSessionComponentItemId(sessionComponentItem.getId());
            itemResponseDto.setQuantity(sessionComponentItem.getQuantity());
            itemResponseDto.setComponentName(sessionComponentItem.getComponent().getComponentName().name());
            itemResponseDto.setType(sessionComponentItem.getComponent().getType());
            itemResponseDto.setCreatedDate(sessionComponentItem.getCreatedAt());
            itemResponseDto.setUpdatedDate(sessionComponentItem.getUpdatedAt());
            sessionComponentItemResponseDtoList.add(itemResponseDto);
    }

        SessionComponentResponseDto responseDto = new SessionComponentResponseDto();
        responseDto.setSessionComponentId(sessionComponent.getId());
        responseDto.setSessionId(sessionComponent.getSession().getId());
        responseDto.setSessionComponentItems(sessionComponentItemResponseDtoList);
        responseDto.setCreatedDate(sessionComponent.getCreatedAt());
        responseDto.setUpdatedDate(sessionComponent.getUpdatedAt());
        return responseDto;
    }


}
