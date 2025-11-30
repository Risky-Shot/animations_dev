import {memo} from 'react';
import { Box, Flex, Input } from '@chakra-ui/react';
import VirtualizedSelect from "@/components/VirtualizedSelect";

function SearchAndSelects({
  immediateQuery,
  handleQueryInputChange,
  filteredDictionaries,
  clips,
  selectedDict,
  selectedClip,
  onSelectDict,
  onSelectClip
}) {
  return (
    <>
      <Box>
        <Input
          className='search-anim-input'
          color={'white'}
          w={'100%'}
          colorPalette={'red'}
          variant="flushed"
          placeholder='Search Animation...'
          size="md"
          value={immediateQuery}
          onChange={handleQueryInputChange}
        />
      </Box>

      <Flex gap="3" paddingTop={'10px'}>
        <VirtualizedSelect
          items={filteredDictionaries}
          value={selectedDict}
          onChange={onSelectDict}
          placeholder="Pick a Dictionary"
          width='66%'
        />
        <VirtualizedSelect
          items={clips}
          value={selectedClip}
          onChange={onSelectClip}
          placeholder="Pick a Clip"
          width='33%'
          disabled={!selectedDict}
        />
      </Flex>
    </>
  );
}

// shallow-compare props; will skip re-render if same references/primitives
export default memo(SearchAndSelects);