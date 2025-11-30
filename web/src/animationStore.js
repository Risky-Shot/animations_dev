//import ANIMATIONS from './assets/animations.json';
import Worker from './dictionaryWorker.js?worker';

export const AnimationFlag = Object.freeze({
  REPEAT: 1,
  STOP_LAST_FRAME: 2,
  UNK_4: 4,
  UPPERBODY: 8,
  ENABLE_PLAYER_CONTROL: 16,
  CANCELABLE: 32,
  UNK_64: 64,
  OFFSET_POSITION: 128,
  OFFSET_POSITION_ENTITY: 256,
  UNK_512: 512,
  UNK_1024: 1024,
  UNK_2048: 2048,
  UNK_4096: 4096,
  UNK_8192: 8192,
  UNK_16384: 16384,
  UNK_IS_ENTITY: 32768
});

function SendToClient(event,data) {
    fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            data: data
        })
    })
}

class AnimationsStore {
    static instance;
    listeners = new Set();
    initialized = false;

    constructor() {
        this.state = {
            show : false,
            query: '',
            dict: '',
            clip: '',
            flags: 0,
            entity: 0,
            blendInSpeed: 1.0,
            blendOutSpeed: 1.0,
            playbackRate: 0.0
        }

        this.animations = {}

        this.worker = new Worker();

        //this.initialize();

        this.loadAnimations();
    }

    static getInstance() {
        if (!AnimationsStore.instance) {
            AnimationsStore.instance = new AnimationsStore();
        }

        return AnimationsStore.instance;
    }

    initialize() {
        if (this.initialized) {
            console.log('Already initialized. Cleaning Up')
            this.cleanup();
        }

        this.initialized = true

        this.loadAnimations();
    }

    updateState(newState) {
        this.state = newState;
        // Update Listeners too ?
        this.listeners.forEach((listener) => listener(this.state))
    }

    async loadAnimations() {
        try {
            const res = await fetch(import.meta.env.BASE_URL + 'animations.json');
            const ANIMATIONS = await res.json();
            const animations = Object.fromEntries(
                Object.entries(ANIMATIONS).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v : []])
            );

            //this.updateState({ ...this.state, animations});
            this.animations = animations;
        } catch(error) {
            console.error('Failed to load Animations.')
        }
    }

    setupClientHandlers() {

    }

    handleAnimationState(event) {
        if (!event) return;

        this.updateState({...this.state, ...event});
    }

    // Play Animation
    playAnimation() {
        // send to client
        SendToClient('animations.play-anim', {
            dict: this.state.dict,
            clip: this.state.clip,
            flags: this.state.flags,
            blendInSpeed: this.state.blendInSpeed,
            blendOutSpeed: this.state.blendOutSpeed,
            playbackRate: this.state.playbackRate,
            entity: this.state.entity
        })
    }

    stopAnimation() {
        SendToClient('animations.stop-anim', {
            entity: this.state.entity
        })
    }

    setQuery(query) {
        this.updateState({...this.state, query});
    }

    setDict(dict) {
        this.updateState({...this.state, dict, clip: ''}); // Reset Clip when dict changes
    }

    setClip(clip) {
        this.updateState({...this.state, clip}); // Reset Clip when dict changes
    }

    setFlags(flags) {
        this.updateState({...this.state, flags});
    }

    updateFlag(flagValue, checked) {
        let newFlags = this.state.flags;

        if (checked) {
            newFlags = this.state.flags | flagValue;
        } else {
            newFlags -= this.state.flags & flagValue;
        }

        this.setFlags(newFlags);
    }

    setEntity(entity) {
        this.updateState({ ...this.state, entity});
    }

    setBlendInSpeed(speed) {
        this.updateState({ ...this.state, blendInSpeed: speed});
    }

    setBlendOutSpeed(speed) {
        this.updateState({ ...this.state, blendOutSpeed: speed});
    }

    setPlaybackRate(rate) {
        this.updateState({ ...this.state, playbackRate: rate});
    }

    getFilteredDictionaries() {
        // const query = (this.state.query || '').trim();
        // if (!query) {
        //     return Promise.resolve([]);
        // }

        return new Promise((resolve) => {
            const keys = Object.keys(this.animations || {});

            this.worker.postMessage({
                query: this.state.query,
                keys
            });

            this.worker.onmessage = (e) => {
                resolve(e.data);
            } 
        });
    }

    getClips() {
        if (!this.state.dict || !this.animations[this.state.dict]) {
            return [];
        }
        return this.animations[this.state.dict];
        
    }

    // Get flags as formatted string
    getFlagsString() {
        const flagStrings = [];

        if ((this.state.flags & AnimationFlag.REPEAT) !== 0) {
        flagStrings.push('AnimFlag.REPEAT');
        }
        if ((this.state.flags & AnimationFlag.STOP_LAST_FRAME) !== 0) {
        flagStrings.push('AnimFlag.STOP_LAST_FRAME');
        }
        if ((this.state.flags & AnimationFlag.UNK_4) !== 0) {
        flagStrings.push('AnimFlag.UNK_4');
        }
        if ((this.state.flags & AnimationFlag.UPPERBODY) !== 0) {
        flagStrings.push('AnimFlag.UPPERBODY');
        }
        if ((this.state.flags & AnimationFlag.ENABLE_PLAYER_CONTROL) !== 0) {
        flagStrings.push('AnimFlag.ENABLE_PLAYER_CONTROL');
        }
        if ((this.state.flags & AnimationFlag.CANCELABLE) !== 0) {
        flagStrings.push('AnimFlag.CANCELABLE');
        }
        if ((this.state.flags & AnimationFlag.UNK_64) !== 0) {
        flagStrings.push('AnimFlag.UNK_64');
        }
        if ((this.state.flags & AnimationFlag.OFFSET_POSITION) !== 0) {
        flagStrings.push('AnimFlag.OFFSET_POSITION');
        }
        if ((this.state.flags & AnimationFlag.OFFSET_POSITION_ENTITY) !== 0) {
        flagStrings.push('AnimFlag.OFFSET_POSITION_ENTITY');
        }
        if ((this.state.flags & AnimationFlag.UNK_512) !== 0) {
        flagStrings.push('AnimFlag.UNK_512');
        }
        if ((this.state.flags & AnimationFlag.UNK_1024) !== 0) {
        flagStrings.push('AnimFlag.UNK_1024');
        }
        if ((this.state.flags & AnimationFlag.UNK_2048) !== 0) {
        flagStrings.push('AnimFlag.UNK_2048');
        }
        if ((this.state.flags & AnimationFlag.UNK_4096) !== 0) {
        flagStrings.push('AnimFlag.UNK_4096');
        }
        if ((this.state.flags & AnimationFlag.UNK_8192) !== 0) {
        flagStrings.push('AnimFlag.UNK_8192');
        }
        if ((this.state.flags & AnimationFlag.UNK_16384) !== 0) {
        flagStrings.push('AnimFlag.UNK_16384');
        }
        if ((this.state.flags & AnimationFlag.UNK_IS_ENTITY) !== 0) {
        flagStrings.push('AnimFlag.UNK_IS_ENTITY');
        }

        return flagStrings.join(' + ');
    }

    getAnimationConfigString() {
        return `dict: '${this.state.dict}', \nanim: '${this.state.clip}', \nflags: ${this.state.flags}`;
    }

    close() {
        this.updateState({ ...this.state, show: false});
        SendToClient('animations.close-anim', {})
    }

    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.state);

        return () => {
            this.listeners.delete(listener);
        }
    }

    getState() {
        return this.state;
    }

    hasFlag(flag) {
        return (this.state.flags & flag) !== 0;
    }

    cleanup() {
        this.listeners.clear();
        this.initialized = false;
    }
}

export default AnimationsStore.getInstance();