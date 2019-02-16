import _ from 'lodash'
import URI from 'urijs'
import URITemplate from 'urijs/src/URITemplate'

// TODO: make 'host' configurable 
import {API_HOST} from '../assets/js/config'

export function HAL(resource){
    return new HALResource(resource)
}

export class HALResource {
    constructor (resource){
        this.resource = resource || {}
        this.host = API_HOST
        this._links = this.resource._links || {}
        this._halifyEmbedded() 
    }

    _halifyEmbedded(){
        let embedded= this.resource._embedded==undefined ? {} : this.resource._embedded

        let rv = {}
        Object.keys(embedded).forEach((k, i)=>{
            if (Array.isArray(embedded[k])){
                rv[k] = _.map(embedded[k], (e)=>{
                    return new HALResource(e)
                })
            } else {
                rv[k] = new HALResource(embedded[k])
            }
        })
        this._embedded = rv
    }

    _link(rel){
        if(this._links[rel]!=undefined){
            return this._links[rel]
        }
        return this._namespacedRel(rel)
    }

    get self(){
        return this.url('self')
    }

    static findIndex(collectionName, item){
        const collection = this.embedded(collectionName)
        return collection.findIndex(i=>{
            new HALResource(i).self==item.self
        })
    }

    // update one item in a collection
    updateItem({collection, identifier, replacement}){
        // get the actual collection
        collection = this.resource._embedded[collection]
        if (!collection || !Array.isArray(collection)){
            // TODO raise an error
            return 
        }
        const idx = collection.findIndex(item=>{
            return item[identifier]==replacement[identifier]
        })
        if (idx < 0){
            // not found
            return
        }
        // replace item with replacement
        collection.splice(idx, 1, replacement)
        return true;
    }

    deleteItem({collection, identifier, value}){
        collection = this.resource._embedded[collection]
        if (!collection || !Array.isArray(collection)){
            // TODO raise an error
            return 
        }
        const idx = collection.findIndex(item=>{
            return item[identifier]==value
        })
        if (idx < 0){
            // not found
            return
        }
        // delete item 
        collection.splice(idx, 1)
        return true;
    }

    href(rel){
        let link = this._link(rel)
        if(link==undefined){
            return
        }
        return link.href
    }

    url (rel, params, qsparams={}){
        let href = this.href(rel)
        if(!href){
            return
        }
        if (params==null) {
            params = {}
        }
        let uri = URI.expand(href, params).search(qsparams)
        if(uri.is('absolute')){
            return uri.toString()
        }
        return uri.absoluteTo(this.host).toString()
    }

    get _curies(){
        return this._links.curies || []
    }
    
    get _namespaces(){
        return _.map(this._curies, (c)=>{
            return c['name']
        })
    }

    _namespacedRel(relation){

        if (this._namespaces.length==0){
            return
        }

        // look for first namespaced rel that matches
        return  _.find(this._links, (lnk, rel)=>{
            // skipping the 'curies' relation
            if (rel=='curies'){
                return
            }
            return _.find(this._namespaces, (ns)=>{
                return rel==ns + ':' + relation
            })
        })
    }

    get data(){
        // no resource
        if (!this.resource || Object.keys(this.resource).length===0){
            return
        }

        const rv = {}
        Object.keys(this.resource).forEach(k=>{
            if(k=='_embedded' || k=='_links'){
                return
            }
            rv[k] = this.resource[k]
        })
        return JSON.parse(JSON.stringify(rv))
    }

    // alias of key()
    prop(p){
        return this.resource[p]
    }

    // alias of prop()
    key(k){
        return this.resource[k]
    }

    embedded(prop){
        return this._embedded[prop]
    }

    get isPartial(){
        return this.resource._partial ? true : false
    }
}
