/* this cookie library is based off of the Mozilla cookie framework 
 * at https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
 * It was rewritten with a focus on legibility. 
 * It uses more actual ES constructs.
 */
function keyval(v){
    if (!Object.values(v)[0]){
        return ""
    }
    return "; "+Object.keys(v)[0]+"="+Object.values(v)[0]
}

/* regex symbols */
const allCharsUpToSeparator = "[^;]"
const anyChar = "."
const BOL = "^"
const EOL = "$"
const cookieSeparator = ";"
const optionalSpaces = "\\s*"
const equals = optionalSpaces + "\\=" + optionalSpaces
/* functions */
const nocapture = (s)=>"(?:" + s + ")"
const capture = (s)=>"(" + s  + ")"
const anyOf = (s1, s2)=>s1 +  "|" + s2
const zeroOrMoreTimes = (s)=>s + "*"

const encodeAndEscape = (s)=>{
    // URI encode the string and
    // replace any of the characters "-.+*" by their escape sequence "\-\.\+\*"
    return encodeURIComponent(s).replace(/[\-\+\*\.]/g, "\\$&") 
}

export default {
    getCookie (key) {
        if (!key) {
            return 
        }

        key = encodeAndEscape(key) 

        const startingPosition = nocapture(
            anyOf(BOL, zeroOrMoreTimes(anyChar) + cookieSeparator))
        
        const regex = new RegExp(anyOf(
            nocapture(
                startingPosition + optionalSpaces + key + equals + 
                capture(zeroOrMoreTimes(allCharsUpToSeparator)) +
                zeroOrMoreTimes(anyChar) + EOL
            ), 
            BOL + zeroOrMoreTimes(anyChar) + EOL)
        )
                
        const item = document.cookie.replace(regex, "$1")
        return decodeURIComponent(item) || null
    },

    setCookie (key, value, end, path, domain, secure) {
        // end : integer (timestamp in milliseconds)
        // key, value, path, domain : string
        // secure : boolean
        // this function doesn't use max-age because neither Edge or 
        // Internet Explorer understand it.
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { 
            return false 
        }

        // cookie concat
        let expires = ""
        if (end) {
            switch (end.constructor) {
                case Number:
                    expires = end === Infinity ? 
                        "; expires=Fri, 31 Dec 9999 23:59:59 GMT" :
                        "; expires=" + (new Date(end * 1000 + 
                                    Date.now())).toUTCString()
                    break
                case String:
                    expires = "; expires=" + end
                    break
                case Date:
                    expires = "; expires=" + end.toUTCString()
                    break
            }
        }
        document.cookie = encodeURIComponent(key) +
            "=" + encodeURIComponent(value) +
            expires + keyval({domain}) +
            keyval({path}) + keyval({secure})
        return true
    },

    removeCookie (key, path, domain) {
        if (!this.hasCookie(key)) {
            return false
        }
        document.cookie = encodeURIComponent(key) + 
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            keyval({domain}) + keyval({path})
        return true
    },

    hasCookie (key) {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { 
            return false
        }
        const expr = nocapture(anyOf(BOL, cookieSeparator + optionalSpaces)) +
            encodeAndEscape(key) + optionalSpaces + "\\="
        return (new RegExp(expr)).test(document.cookie);
    },

    keys () {
        // 1st option:
        // capture a sequence of characters with the following caracteristics:
        // - it starts with either the beginning of line or a sequence of 
        // optional spaces followeb by a semicolon.
        // - then follows a set of 1 or more characters other than `=` 
        // - The above sequence only applies if it's followed by a semicolon 
        // or an end of line.
        //
        // 2nd option:
        // a sequence of spaces
        //
        // 3rd option:
        // - a sequence of spaces 
        // - followed by an optional sequence
        //      - `=` possibly followed by a set of characters other than the
        //      semicolon.
        // - followed by a sequence that matches the 1st option or and end of line 
        const regex = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g
        // - optional spaces
        // - followed by an optional sequence
        //      - `=` followed by zero or more non semicolon characters
        // - followed by a semicolon
        // - followed by zero or more spaces
        const split = /\s*(?:\=[^;]*)?;\s*/

        var aKeys = document.cookie.replace(
            /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
}
