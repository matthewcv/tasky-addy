    define("keys", () =>{
        var map = {
            16:'shift',
            17:'ctrl',
            18: 'alt', //or option
            91: 'command',//(mac), or start (windows)
            8:'backspace',
            9:'tab',
            13:'enter',
            27:'escape',
            32:'space',
            37:'left',
            38:'up',
            39:'right',
            40:'down',
            46:'delete',
            35:'end',
            36:'home',
            33:'pageup',
            34:'pagedown',
            188:',',
            190:'.',
            191:'/',
            192:'`',
            189:'-',
            187:'=',
            186:';',
            222:"'",
            219:'[',
            221:']',
            220:'\\'
        }
        
        for(let char of "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"){
            map[char.charCodeAt(0)] = char.toLowerCase();
        }
        
        var mods ={
        'shiftKey':16,
        'altKey':18,
        'ctrlKey':17,
        'metaKey':91            
        }
        
        /**
         *  given a keyboard event, look for all the keys that are currently pressed. If called with one parameter, the event, it will return
         * an array of all the keys pressed. If called with two parameters, the event and an array or string of keys to query, it will return true
         * or false if the keys currently pressed matches the query. 
        */
        return function keys(evt, query){
            if(evt.keyCode){
                var keys = new Set();
                keys.add(map[evt.keyCode])
                
                for(let mod in mods){
                    if(evt[mod]){
                        keys.add(map[mods[mod]])
                    }
                }
                
                if(query){
                    
                    if(typeof(query) === 'string'){
                        query = query.split('+')
                    }
                    if(query.length == keys.size){
                        for(let i = 0; i < query.length; i++){
                            if(!keys.has(query[i])){
                                return false;
                            }
                        }
                        return true;
                    }
                    return false
                }else{
                    return [...keys]
                }
            }
        }
        
        
        
    })    
