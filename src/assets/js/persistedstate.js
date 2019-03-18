import merge from 'deepmerge';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function shvlGet (object, path, def) {
    // for each segment in path, resolve the value 
    // if final value is undefined return default value
    // else return final value
    return (object = (path.split ? path.split('.') : path).reduce((obj, p) => {
            return obj && obj[p]
        }, object)) === undefined ? def : object
}


function shvlSet (object, path, val, obj) {
    // for each segment in path, resolve the value
    return ((path = path.split ? path.split('.') : path).slice(0, -1).reduce(
        (obj, p) => {
            return obj[p] = obj[p] || {}
        // set the last segment to val and return `object`
        }, obj = object)[path.pop()] = val), object
};


export default function(options, storage, key) {
    options = options || {};
    storage = options.storage || (window && window.localStorage);
    key = options.key || 'vuex';
    const vuexTabId = uuidv4()

    function canWriteStorage(storage) {
        try {
            storage.setItem('@@', 1);
            storage.removeItem('@@');
            return true;
        } catch (e) {}

        return false;
    }

    function getState(key, storage, value) {
        // return the JSON object stored in 'vuex' key in storage
        try {
            return (value = storage.getItem(key)) && typeof value !== 'undefined'
                ? JSON.parse(value) : undefined;
        } catch (err) {}

        return undefined;
    }

    function filter() {
        return true;
    }

    function setState(key, state, storage) {
        // store stringified version of state at key 'vuex' in storage
        return storage.setItem(key, JSON.stringify(state));
    }

    function subscriber(store) {
        return function(handler) {
            return store.subscribe(handler);
        };
    }

    if (!canWriteStorage(storage)) {
        throw new Error('Invalid storage instance given');
    }

    // factory function called when initializing store
    return function(store) {
        // try to get the `getState` function from options
        // if unsuccessful, return the `getState` function defined above 
        // that simply returns the JSON object located at key 'vuex' of the 
        // storage.
        const savedState = shvlGet(options, 'getState', getState)(key, storage);

        // if storage is a non-null object
        if (typeof savedState === 'object' && savedState !== null) {
            // merge saved state and store state
            store.replaceState(merge(store.state, savedState, {
                arrayMerge: options.arrayMerger || function (store, saved) { return saved },
                clone: false,
            }));
        }

        // register a handler on store and listen to mutations
        (options.subscriber || subscriber)(store)(function(mutation, state) {
            // proceed if filter allows it 
            if ((options.filter || filter)(mutation)) {
                // set state in storage
                (options.setState || setState)(key, state, storage)
                storage.setItem('vuexTabId', vuexTabId)
            }
        });

        // adding this to handle changes from various tabs
        window.addEventListener("storage", e => {
            if (e.key !== key) return

            // exit if no change
            //if (e.newValue === JSON.stringify(this.$store.state)) return
            // if this tab is responsible for triggering the event, then we're
            // already up to date.
            if (vuexTabId===JSON.stringify(storage.getItem('vuexTabId'))) return

            const persistedData = JSON.parse(e.newValue)
            store.replaceState(shvlGet(options, 'getState', getState)(key, storage))
        })

    };
};
