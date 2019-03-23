import _ from 'lodash/fp'
import findIndex from 'lodash/fp/findIndex'
import find from 'lodash/fp/find'
import times from 'lodash/fp/times'

import URI from 'urijs'

export function Cache(storage){
    return new CacheManager(storage)
}

export function Buffer(storage, buffersize, maxTime){
    return new BufferedStorage(storage, buffersize, maxTime)
}

// this is the set of chars used to create new keys in for the Lock
// TODO: find a way to set it as a class property
let chars = 'abcdefghijklkmnopqrstuvwxyz'
chars = chars + chars.toUpperCase()
chars = chars + '1234567890'

class Lock{
    constructor(object){
        // the object that is accessed asynchronously
        this.object = object
        // the key that'll be used for locking the object before read/write
        this.key = this._createKey()
    }

    /* this method creates the key */ 
    _createKey(){
        // the key is made up of two parts
        // - a random sequence of characters
        // - a timestamp (a back up in case we're dealing with a poor random 
        // generator)
        
        // the random sequence where characters will be buffered
        const seq = []
        // the size of the random sequence
        const size = 15 
        // the distribution is how many characters are available to us for 
        // the random sequence.
        const distr = chars.length

        // generate <size> random characters
        for(let i=0; i<=size; i++){
            // to generate one character:
            // - Math.random() gives us a random float between 0 (inclusive) 
            // and 1 (exclusive)
            // - we multiply it by the distribution. e.g. if the distribution
            // is 26 characters, multiplying by the random should give us
            // between 0 and 25.xxx.
            // - we round up which should give us an integer between 1 and 26
            // - we remove one to go down to zero base indexing 
            let index = Math.ceil(Math.random() * distr) - 1 
            // we add the corresponding character to the buffer
            seq.push(chars[index])
        }
        // we join and add the timestamp for good measure
        return seq.join('') + Date.now()
    }

    acquire(){
        // to lock the object, place the key in its lock queue
        this.object.lock.push(this.key)
        // and wait for it to be pushed at the top
        while(this.object.lock[0]!=this.key){
            // wait
        }
        // object is now locked
    }

    release(){
        // to release the object, wait for the key to come up the stack and
        // release it.
        // Normally this scenario should not arise and there shouldn't be a
        // need to wait, but one never knows...
        // this could happen if a release command was somehow sent before 
        // a lock, just for giggles!
        while(this.object.lock[0]!=this.key){
            // wait
        }
        // remove key from top of lock queue
        this.object.lock.shift()
    }
}

/* Locks are acquire through this class. 
 * Typically managing objects that simulaneously manipulate a resource
 * would each get an instance of this factory and would pass it the resource.
 * Then prior to each read or write operation to the resource they would
 * acquire a lock that would be released at the end of the said operation.
 * */
class LockFactory{

    constructor(object){
        // the resource being accessed asynchronously
        this.object = object
    }

    acquire(){
        // obtaining a Lock
        const lock = new Lock(this.object)
        // locking the resource
        lock.acquire()
        // returning the lock to the caller, as it will be needed 
        // to release the resource at the end of the read/write.
        return lock
    }
}

class BufferedStorage {

    // 70 entries, maximum 5 minutes old
    constructor(storage, bufferSize, maxTime){

        const defaultBufferSize = 70
        const defaultMaxTime = 300

        // the resource 
        this.storage = storage
        // keep a reference to the stack housing the data
        this.stack = storage.stack
        
        // the default max size of the buffer
        this.bufferSize = bufferSize || storage.bufferSize || defaultBufferSize 
        // the lock factory for safe asynchronous access during read/write
        this.lock = new LockFactory(this.storage)
        // default maximum time a resource should stay in the storage (in 
        // second)
        this.maxTime = maxTime || storage.maxTime || defaultMaxTime
        // first, trim stale data
        this.trim()
    }

    store(path, value){
        const lock = this.lock.acquire() // lock resource for read/write.
        // Build a deterministic key based on provided path.
        // i.e. same path params, same key, each time.
        const key = this._makeKey(path)
        // insert data at location pointed by key as the most recent entry.
        this._insert(key, value)
        lock.release() // release resource
    }

    fetch(path){
        const lock = this.lock.acquire() // lock resource for read/write
        const key = this._makeKey(path) // make key based on path
        // find container housing the data
        const container = this._find(key)
        if(container===undefined){
            // if no container was found end here
            lock.release() // release resource
            return
        }
        // move container to the top and make it the most recent entry. It
        // helps keep frequently read entries in storage (as long as they're
        // within their expiry time).
        this._moveTop(container) 
        lock.release() // release resource
        // return the data
        return container.value
    }

    remove(path){
        const lock = this.lock.acquire() // lock resource for read/write
        const key = this._makeKey(path) // make key based on path
        // remove the corresponding container
        this._popKey(key)
        lock.release() // release resource
    }

    trim(){
        const lock = this.lock.acquire() // lock resource for read/write
        // remove all data past their expiry
        this._trimExpired()
        // remove all data extending beyond the default buffer size.
        // this is useful if a the manager is configured to work with a 
        // more restrictive size than another manager currently accessing
        // the same resource.
        // TBD: this could create some conflicts. Needs a review.
        this._trimOverflow()
        lock.release() // release resource
    }

    clear(){
        const lock = this.lock.acquire() // lock resource for read/write
        // empty the storage
        while(true){
            let container = this.stack.pop()
            if(!container){
                break
            }
        }
        lock.release() // release resource
    }

    // just an alisa to the `clear()` method 
    reset(){
        this.clear()
    }


    // a public handle to allow trimming overflowing data asynchronously
    trimOverflow(){
        const lock = this.lock.acquire() // lock resource for read/write
        this._trimOverflow()
        lock.release() // release resource
    }

    // a public handle to allow trimming expired data asynchronously
    trimExpired(){
        const lock = this.lock.acquire() // lock resource for read/write
        this._trimExpired()
        lock.release() // release resource
    }

    /* Data is stored as hash in a stack (objects in an array). The key of
     * each object allows us to find when looping through the stack.
     */
    _find(key){
        // find returns item if found, or undefined otherwise
        return find(item=>{
            return item.key==key
        })(this.stack)
    }

    /* This function simply returns the index of the location. It can then
     * be used for other operations, such as splicing.
     */
    _findIndex(key){
        // findIndex returns index if found, or -1 otherwise
        return findIndex(item=>{
            return item.key==key
        })(this.stack)
    }

    _moveTop(container){
        const index = this._findIndex(container.key)
        if(index==-1 || index===undefined){
            return
        }
        // remove container
        this.stack.splice(index, 1)
        // reinsert it at the top of stack
        this.stack.push(container)
    }


    _makeKey(path){
        if (!path){
            path = {}
        }
        // flatten({}) will return 0
        return flatten(path)
    }

    _insert(key, value){
        // delete old version
        const replacing = this._popKey(key) && true 
        // inserting new version
        const container = this._makeContainer(key)
        container['value'] = value

        // if indeed we replaced something, let's end here
        if (replacing){
            return
        }
        // on the other hand if this was an addition, let's 
        // remove overflowing entries, if any.
        this._trimOverflow()
    }

    _trimOverflow(){
        // if we're within the range we're good
        if(this.stack.length<this.bufferSize){
            return
        }
        // else remove overflowing entries in FIFO
        while(this.stack.length>=this.bufferSize){
            // `stack.pop()` would remove last element added
            this.stack.shift()
        }
    }

    _trimExpired(){
        let i=0;
        const now = Date.now()/1000
        while(true){
            let container = this.stack[i]
            if(!container){
                // end of array
                break 
            }
            let maxts = container.timestamp + this.maxTime
            if(maxts <= now){
                this._popIndex(i)
            } else {
                // only move index if nothing was removed from array
                i++
            }
        }
    }

    _popIndex(index){
        // remember that splice returns an array
        return this.stack.splice(index, 1)[0]
    }

    _popKey(key){
        const index = this._findIndex(key)
        if (index==-1){
            return
        }
        return this._popIndex(index)
    }

    _makeContainer(key){
        const container = {
            key,
            timestamp: parseInt(Date.now()/1000), // timestamp in seconds
            value: null,
        }
        this.stack.push(container)
        return container
    }
}


export class CacheManager {

    constructor(storage){
        this.storage = storage
    }

    cache(key){
        if (!this.storage[key]){
            this.storage[key] = {}
        }
        return this.storage[key]
    }

    hash(params){
        if (!params){
            params = {}
        }
        // flatten({}) will return 0
        return flatten(params)
    }

    keyversion(uri){
        /* the point of this function is to enable storing resources that can 
         * have different versions based on their params. For example, a 
         * partial representation of a product vs a full representation.
         * */

        uri  = URI(uri)
        let params = uri.query(true)
        let key = this.hash({host: uri.host(), path: uri.path()})
        let version = this.hash(params)
        return {key, version}
    }

    store(uri, value){
        //let key, version
        let {key,version} = this.keyversion(uri)
        this.cache(key)[version] = value
    }

    fetch(uri){
        let {key,version} = this.keyversion(uri)
        return this.cache(key)[version]
    }

    remove(uri){
        let {key,version} = this.keyversion(uri)
        delete this.cache(key)[version]
    }

    clear(uri){
        let {key,version} = this.keyversion(uri)
        this.storage[key] = {}
    }

    reset(uri){
        this.clear(uri)
    }
}

// a deterministic hashing function for query string params
function flatten(params){
    // if params is an object
    if (params instanceof Object){ 
        // if params is *actually* an object
        if (Array.isArray(params)===false){
            let keys = Object.keys(params).filter(k=>{
                return params[k]!=undefined
            }).sort()
            let flattened = keys.map(k=>{
               return [k,flatten(params[k])].join(':')
            }).join()
            return hashCode(flattened)
        // else if params is an array
        }else{
            let flattened = params.filter(item=>{
                // pop unset items
                return item!=undefined
            }).map(item=>{
                return flatten(item)
            }).sort().join()
            return hashCode(flattened)
        }
    }
    // if params is not an object (nor array)
    return hashCode('' + params)
}

function hashCode (str) {
    // see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    let hash = 0 
    if (str.length === 0){
        return hash
    }
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i)
        hash  = ((hash << 5) - hash) + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

//module.exports = {Cache, flatten, hashCode}
