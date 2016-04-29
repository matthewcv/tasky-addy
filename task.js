    define("Task", () =>{
        var taskId = 0;
        class Task{
            
            constructor(init){
                this.name = null;
                this._time = null;
                this.notes = null;
                this.childTasks = [];
                this.isRoot = false;
                this.parentTask = null;
                this.id = taskId++;
                if(init){
                    this.name = init.name;
                    this.id = init.id;
                    this.time = init.time;
                    if(init.childTasks && init.childTasks.length){
                        init.childTasks.forEach(ct => {
                            this.addChild(new Task(ct))
                        })
                    }
                }
            }
            
            get time(){
                
                if(this.childTasks.length){
                    let time = 0;
                    this.childTasks.forEach(c => time += c.time)
                    return time;
                }
                return this._time;
            }
            
            set time(t){
                this._time = t;
            }
            
            toJSON(){
                return {
                    name:this.name,
                    time:this.time,
                    notes:this.notes,
                    childTasks:this.childTasks,
                    id:this.id
                }
            }
            
          
            isLastChild(){
                //whether i am the last child in my parent's childTasks
                return this.nextSibling() == null;
            }
            
            isFlattenedLastChild(){
                //whether I am the last child of the last child all the way up to the root task. In other words, the bottom task in the list no matter what my parent is
                var task = this;
                while(!task.isRoot && task.isLastChild()){
                    task = task.parentTask;
                }
                return task.isRoot;  
            }
            
            getFlattenedLastChild(){
                var lastChild = this.lastChild();
                var nextLast = null;
                while(lastChild != null && (nextLast = lastChild.lastChild()) != null ){
                    lastChild = nextLast;
                }
                return lastChild;
                
            }
            newSibling(){
                var sibling = new Task();
                if(this.isLastChild()){
                    this.parentTask.addChild(sibling);
                }else{
                    this.parentTask.addChild(sibling, this.myIndex() + 1);
                }
                return sibling;
            }
            addChild(child, at){
                if(child.parentTask){
                    child.parentTask.removeChild(child);
                }
                child.parentTask = this;
                if(at == undefined){
                    this.childTasks.push(child)
                }else{
                    this.childTasks.splice(at,0,child)
                }
            }
            
            removeChild(child){
                if(this.childTasks.indexOf(child) >= 0){
                    this.childTasks.splice(child.myIndex(),1);
                    child.parentTask = null;
                }
            }
            

            indent(){
                var prev = this.previousSibling();
                if(prev != null){
                    prev.addChild(this);
                    return true;
                } 
            }
            
            outdent(){
                if(!this.parentTask.isRoot){
                    
                    var last = this.lastSibling();
                    while(last != null){
                        last.outdent();
                        last = this.lastSibling();
                    }
                    
                    var parentIdx = this.parentTask.myIndex();
                    var newParent = this.parentTask.parentTask;
                    newParent.addChild(this,parentIdx +1);
                    return true;
                }
            }
            
            moveUp(){
                var fp = this.getFlattenedPrevious();
                if(fp != null){
                    var fpp = fp.getFlattenedPrevious();
                    if(fpp != null){
                        if(fp.parentTask == fpp){
                            fpp.addChild(this,fp.myIndex())
                        }else if(fp.parentTask == fpp.parentTask){
                            fp.parentTask.addChild(this,fp.myIndex())
                        }else{
                            fpp.parentTask.addChild(this)
                        }
                    }else{
                        fp.parentTask.addChild(this, fp.myIndex())
                    }
                    return true;
                }
            }
            
            moveDown(){
                var fn = this.getFlattenedNext();
                if(fn && fn.parentTask == this){
                    fn = this.getFlattenedLastChild().getFlattenedNext()
                }
                if(fn){
                    if(fn.childTasks.length > 0){
                        fn.addChild(this,0)
                    }else{
                        var offset = fn == this.nextSibling() ? 0:1
                        fn.parentTask.addChild(this, fn.myIndex()+offset)
                    }
                    return true
                }
            }
            
            myIndex(){
                return this.parentTask.childTasks.indexOf(this);   
            }
            previousSibling(){
                var myIdx = this.myIndex();
                if(myIdx > 0){
                    return this.parentTask.childTasks[myIdx-1]
                }
                return null;
            }
            nextSibling(){
                var myIdx = this.myIndex();
                if(myIdx < this.parentTask.childTasks.length -1){
                    return this.parentTask.childTasks[myIdx+1]
                }
                return null;
            }
            lastSibling(){
                var lastIdx = this.parentTask.childTasks.length -1;
                if(this.myIndex() == lastIdx){
                    return null;
                }
                return this.parentTask.childTasks[lastIdx];
            }
            firstSibling(){
                if(this.myIndex == 0){
                    return null;
                }
                return this.parentTask.childTasks[0];
            }
            firstChild(){
                if(this.childTasks.length == 0){
                    return null;
                }
                return this.childTasks[0];
            }
            lastChild(){
                if(this.childTasks.length == 0){
                    return null;
                }
                return this.childTasks[this.childTasks.length-1];
            }
            
            getFlattenedNext(){
                //gets the next task as if the whole thing was a flattened list
                
                                
                var n = this.firstChild() || this.nextSibling();
                if(n){
                    return n;
                }
                
                var p = this.parentTask;
                while(!p.isRoot){
                    var pn = p.nextSibling();
                    if(pn){
                        return pn;
                    }
                    p = p.parentTask;
                }
            }
            
            getFlattenedPrevious(){
                //gets the previous task as if the whole thing was a flattened list
                
                var p = this.previousSibling();
                if(p){
                    var pl = p.getFlattenedLastChild();
                    
                    if(pl){
                        return pl;
                    }
                    return p;
                }
                if(!this.parentTask.isRoot){
                    return this.parentTask;
                }
                return null;
            }
        }
        return Task;
                
    });
