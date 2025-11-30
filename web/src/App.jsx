import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

import { Container, Collapsible} from '@chakra-ui/react';

import animationStore from './animationStore.js';

import { useNuiEvent } from './useNuiEvent.js';

import SearchAndSelect from './components/SearchAndSelect';

import FlagsPanel from './components/FlagsPanel';
import ControlsPanel from './components/ControlsPanel';
import BottomPanel from './components/BottomPanel';

function App() {
  const [state, setState] = useState(animationStore.getState());

  //state.show = true;

  const [immediateQuery, setImmediateQuery] = useState('');
  const [query, setQuery] = useState('');
  const [filteredDictionaries, setFilteredDictionaries] = useState([]);

  const [selectedDict, setSelectedDict] = useState(null);
  const [selectedClip, setSelectedClip] = useState(null);

  const [localFlags, setLocalFlags] = useState(animationStore.getState().flags || 0);

  useNuiEvent('setVisible', async (data) => {
    if (!data) return;

    const current = animationStore.getState();

    animationStore.updateState({ ...current, show: data.state });

  })

  useEffect(() => {
    let active = true;

    animationStore.getFilteredDictionaries().then(result => {
      if (active) setFilteredDictionaries(result);
    });

    return () => {
      active = false; // avoid setting state after unmount
    };

  }, [state.query]);

  useEffect(() => {
    const unsubscribe = animationStore.subscribe(s => {
      setState(s);
      if (typeof s.flags === 'number') setLocalFlags(s.flags);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  const updateFlag = useCallback((e) => {
    const flagNumber = Number(e.target.value);
    const checked = e.target.checked;
    // optimistic update
    setLocalFlags(prev => checked ? (prev | flagNumber) : (prev & ~flagNumber));
    // persist to store
    animationStore.updateFlag(flagNumber, checked);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      animationStore.setQuery(query);
    }, 100);

    return () => clearTimeout(id);
  }, [query])

  const onEscape = useCallback(() => {
    animationStore.close()
  }, []);

  //useEscapeKey(state.show, onEscape);

  const handleESC = (e) => {
      if (e.key === 'Escape') {
          if (state.show) {
              onEscape();
          }
      }
  };

    useEffect(() => {
        window.addEventListener('keydown', handleESC);

        return () => window.removeEventListener('keydown', handleESC);
    }, [state.show]);

  const handleQueryInputChange = useCallback((e) => {
    const value = e.target.value;

    setImmediateQuery(value);
    setQuery(value);

    setSelectedDict(null);
    setSelectedClip(null);
  }, [setImmediateQuery, setQuery, setSelectedDict, setSelectedClip]);

  const handleSelectDict = useCallback((d) => {
    setSelectedDict(d);
    animationStore.setDict(d);
  }, []);

  const handleSelectClip = useCallback((c) => {
    setSelectedClip(c);
    animationStore.setClip(c);
  }, []);

  const setEntity = useCallback((e) => {
    animationStore.setEntity(Number(e.target.value));
  }, []);

  const setBlendInSpeed = useCallback((e) => {
    animationStore.setBlendInSpeed(Number(e.target.value));
  }, []);

  const setBlendOutSpeed = useCallback((e) => {
    animationStore.setBlendOutSpeed(Number(e.target.value));
  }, []);

  const setPlaybakcRate = useCallback((e) => {
    animationStore.setPlaybackRate(Number(e.target.value));
  }, []);

  const playAnim = useCallback(() => {
      animationStore.playAnimation();
  }, []);

  const stopAnim = useCallback(() => {
    animationStore.stopAnimation();
  }, []);

  const clips = useMemo(() => animationStore.getClips(), [state.dict]);
  //const flagsString = animationStore.getFlagsString();
  const animationConfigString = useMemo(() => animationStore.getAnimationConfigString(), [state.dict, state.clip, state.flags]);

  return (
    state.show && (
      <Container w={'950px'} gap="2" bg={'rgba(0,0,0,0.55)'} borderRadius={10} padding={'16px 24px'} top={'10'}> 
        <Collapsible.Root>
          <Collapsible.Trigger paddingY="1" w={'100%'} color='white'>Access Animation Menu</Collapsible.Trigger>
          <Collapsible.Content>
              <SearchAndSelect
                immediateQuery={immediateQuery}
                handleQueryInputChange={handleQueryInputChange} // wrap with useCallback
                filteredDictionaries={filteredDictionaries}     // keep stable reference (useState)
                clips={clips}
                selectedDict={selectedDict}
                setSelectedDict={setSelectedDict}
                selectedClip={selectedClip}
                setSelectedClip={setSelectedClip}
                onSelectDict={handleSelectDict}
                onSelectClip={handleSelectClip}
              />
              <FlagsPanel localFlags={localFlags} updateFlag={updateFlag} />
              <ControlsPanel 
                setBlendInSpeed={setBlendInSpeed}
                setBlendOutSpeed={setBlendOutSpeed}
                setPlaybackRate={setPlaybakcRate}
                setEntity={setEntity}
                entity={state.entity}
              />
              <BottomPanel 
                configString={animationConfigString}
                handlePlay={playAnim}
                handleStop={stopAnim}
              />
            </Collapsible.Content>
      </Collapsible.Root>
      </Container>

    )
  )
}

export default App
