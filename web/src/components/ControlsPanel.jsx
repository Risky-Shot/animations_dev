import { memo, useCallback } from "react";

import { Slider, NumberInput, Grid, HStack } from "@chakra-ui/react";

const SliderItem = memo(function SliderItem({max, min, step, label, marks, onChange, defaultValue}){

    const handleChange = useCallback((e) => onChange(e), [onChange]);

    return (
        <Slider.Root defaultValue={defaultValue} max={max} step={step} min={min} onChange={handleChange} variant={'outline'}>
            <HStack justify="space-between">
                <Slider.Label>{label}</Slider.Label>
                <Slider.ValueText />
            </HStack>
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
                <Slider.Marks marks={marks} />
            </Slider.Control>
        </Slider.Root>
    )
});

function ControlsPanel({setBlendInSpeed, setBlendOutSpeed, setPlaybackRate, setEntity, entity}) {

    return (
        <Grid templateColumns="repeat(4, 1fr)" gap="5" paddingTop='10px' color='white'>
            <SliderItem 
                max={2.0} 
                step={0.1} 
                min={0.1} 
                label={'Blend In Speed'}
                onChange={setBlendInSpeed}
                marks={[[0.1, 1, 2.0]]}
                defaultValue={[1.0]}
            />
            <SliderItem 
                max={2.0} 
                step={0.1} 
                min={0.1} 
                label={'Blend Out Speed'}
                onChange={setBlendOutSpeed}
                marks={[0.1, 1, 1.0]}
                defaultValue={[1.0]}
            />
            <SliderItem 
                max={1.0} 
                step={0.01} 
                min={0.0} 
                label={'Playback Rate'}
                marks={[0.0, 0.5, 1.0]}
                onChange={setPlaybackRate}
                defaultValue={[0.0]}
            />
            <NumberInput.Root variant={'subtle'} size="md" color='black'>
                <NumberInput.Input placeholder='Entity Id' onChange={setEntity}/>
            </NumberInput.Root>
        </Grid>
    )
}

export default memo(ControlsPanel)