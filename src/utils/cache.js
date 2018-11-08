import URI from 'urijs'

export function Cache(storage){
    return new CacheManager(storage)
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
