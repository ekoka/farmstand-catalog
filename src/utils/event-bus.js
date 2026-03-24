/* A simple event bus.
 * To use:
 *
 *
 * */
export default (listeners={}) => {

    function getListeners(name) {
        // listener's structure: 
        // { event name, handler function, calling context, group tag, unique key }
        return listeners[name] || (listeners[name] = [])
    }
    
    function emit (name, eventPayload={}) {
        getListeners(name).forEach(listener => {
            listener.handler.call(listener.ctx, eventPayload)
        })
    }

    /* Group tags are practical when the same function is used in multiple 
     * listeners for the same event.
     * With event name and a tag, listeners can be unregistered as a subset.
     * The key is expected to be unique. It's recommended to let the library 
     * handle it.
     * The function returns a callback to unregister the listener.
     */
    function on (name, handler, { ctx, tag, key=Symbol() }={}) {
        getListeners(name).push({ handler, ctx, tag, key })
        return () => off(name, { key } )
    }

    function once (name, handler, { ctx, tag, key=Symbol() }={}) {
        function wrapper(eventPayload) {
            off(name, { key })
            handler.call(ctx, eventPayload)
        }
        return on(name, wrapper, { ctx, tag, key })
    }

    function off (name, { handler, tag, key }={}) {
        /* 
         * Name of event is required.
         * Specifying only `name` removes all listeners for that event.
         * Passing `handler` removes all listeners for that event with that function. 
         * Specifying `tag` removes all listeners for that event with that tag.
         * Passing `handler` and `tag` removes all listeners for that event with that 
         * function and tag. 
         * Passing `key` removes the one listener for that event associated with it.
         * */

        if (key) {
            listeners[name] = getListeners(name).filter(h => h.key!==key)
        } else if (handler && tag) {
            listeners[name] = getListeners(name).filter(h => h.handler!==handler || h.tag!==tag)
        } else if (handler || tag) {
            listeners[name] = getListeners(name).filter(h => h.handler!==handler && h.tag!==tag)
        } else {
            listeners[name] = [] // remove all
        }

        if (!listeners[name].length) {
            delete listeners[name];
        }
    }

    return { on, emit, off, once }
}

