package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.ComponentRequestDto;
import lk.kn.elms.dto.response.ComponentResponseDto;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Component;
import lk.kn.elms.model.enums.ComponentName;
import lk.kn.elms.repository.ComponentRepository;
import lk.kn.elms.service.ComponentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ComponentServiceImpl implements ComponentService {

    private ComponentRepository componentRepository;

    @Override
    public ComponentResponseDto addComponent(ComponentRequestDto componentRequestDto) {

        ComponentName componentName = ComponentName.valueOf(componentRequestDto.getComponentName());

        Optional<Component> optionalComponent = componentRepository
                .findByComponentNameAndType(componentName, componentRequestDto.getType());

        if(optionalComponent.isPresent()){
            Component component = optionalComponent.get();
            Integer existingQuantity = component.getQuantity();
            component.setQuantity(existingQuantity + componentRequestDto.getQuantity());
            componentRepository.save(component);
            return mapEntityToResponseDto(component);
        }

        else {
            Component component = new Component();
            component.setComponentName(ComponentName.valueOf(componentRequestDto.getComponentName()));
            component.setType(componentRequestDto.getType());
            component.setQuantity(componentRequestDto.getQuantity());
            componentRepository.save(component);
            return mapEntityToResponseDto(component);
        }
    }

    @Override
    public ComponentResponseDto deductComponent(ComponentRequestDto componentRequestDto) throws ResourceNotFoundException, ResourceInsufficientException {

        ComponentName componentName = ComponentName.valueOf(componentRequestDto.getComponentName());
        Component component = componentRepository
                .findByComponentNameAndType(componentName,componentRequestDto.getType()).orElseThrow(()->
                        new ResourceNotFoundException("There is no such a component"));

        Integer existingQuantity = component.getQuantity();

        if (existingQuantity < componentRequestDto.getQuantity()){
            throw new ResourceInsufficientException("Insufficient quantity !");
        }

        component.setQuantity(existingQuantity - componentRequestDto.getQuantity());
        componentRepository.save(component);

        return mapEntityToResponseDto(component);
    }

    @Override
    public ComponentResponseDto updateComponent(ComponentRequestDto componentRequestDto) throws ResourceNotFoundException {

        ComponentName componentName = ComponentName.valueOf(componentRequestDto.getComponentName());

        Component component = componentRepository
                .findByComponentNameAndType(componentName,componentRequestDto.getType()).orElseThrow(()->
                        new ResourceNotFoundException("There is no such a component"));

        component.setComponentName(ComponentName.valueOf(componentRequestDto.getComponentName()));
        component.setType(componentRequestDto.getType());
        component.setQuantity(componentRequestDto.getQuantity());
        componentRepository.save(component);
        return mapEntityToResponseDto(component);
    }

    @Override
    public List<ComponentResponseDto> getAllComponents() throws ResourceNotFoundException {

        List<Component> components = componentRepository.findAll();

        if (components.isEmpty()) {
            throw new ResourceNotFoundException("No components found");
        }

        List<ComponentResponseDto> componentResponseDtoList = new ArrayList<>();
        for (Component component : components) {
            ComponentResponseDto dto = mapEntityToResponseDto(component);
            componentResponseDtoList.add(dto);
        }

        return componentResponseDtoList;
    }

    @Override
    public List<ComponentResponseDto> getComponentByName(String componentName) throws ResourceNotFoundException {

        ComponentName compName = ComponentName.valueOf(componentName);
        List<Component> components = componentRepository.findByComponentName(compName);

        if (components.isEmpty()) {
            throw new ResourceNotFoundException("No components found with the name: " + componentName);
        }

        List<ComponentResponseDto> componentResponseDtoList = new ArrayList<>();
        for (Component component : components) {
            ComponentResponseDto dto = mapEntityToResponseDto(component);
            componentResponseDtoList.add(dto);
        }

        return componentResponseDtoList;
    }

    @Override
    public ComponentResponseDto getComponentByNameAndType(String componentName, String type) throws ResourceNotFoundException {

        ComponentName compName = ComponentName.valueOf(componentName);
        Component component = componentRepository
                .findByComponentNameAndType(compName, type).orElseThrow(()->
                        new ResourceNotFoundException("There is no such a component"));

        return mapEntityToResponseDto(component);
    }

    @Override
    public ComponentResponseDto getComponentById(Long id) throws ResourceNotFoundException {

        Component component = componentRepository
                .findById(id).orElseThrow(()->
                        new ResourceNotFoundException("There is no such a component"));

        return mapEntityToResponseDto(component);
    }

    @Override
    public void deleteComponent(Long id) throws ResourceNotFoundException {

        Component component = componentRepository
                .findById(id).orElseThrow(()->
                        new ResourceNotFoundException("There is no such a component"));

        componentRepository.delete(component);

    }

    private ComponentResponseDto mapEntityToResponseDto(Component component){

        ComponentResponseDto componentResponseDto = new ComponentResponseDto();
        componentResponseDto.setComponentId(component.getId());
        componentResponseDto.setComponentName(component.getComponentName().toString());
        componentResponseDto.setType(component.getType());
        componentResponseDto.setQuantity(component.getQuantity());
        componentResponseDto.setCreatedAt(component.getCreatedAt());
        componentResponseDto.setUpdatedAt(component.getUpdatedAt());
        return componentResponseDto;
    }
}
