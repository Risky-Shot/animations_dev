import { memo } from "react";

import { Flex, Button, Textarea } from "@chakra-ui/react";

function BottomPanel({configString, handlePlay, handleStop}) {
    return (
        <Flex paddingTop='10px' gap='2'>
            <Flex w='100%' gap='2' direction='column'>
                <Button variant={'surface'} colorPalette={'green'} onClick={handlePlay}>Play</Button>
                <Button variant={'surface'} colorPalette={'red'} onClick={handleStop}>Stop</Button>
            </Flex>
            <Textarea w='100%' h='auto' color='white' resize="none" value={configString} readOnly/>
        </Flex>
    )
}

export default memo(BottomPanel)