import { Component } from '@angular/core';
import {Task,BaseTask} from '../Task';
import {Settings,ISettings } from '../main'
import {keys} from '../keys'

@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 3 App</h1>'
})
export class AppComponent { 

              rootTask: Task;
              saveFileName:string = "";
              settings:ISettings;
              constructor(){
            
                this.rootTask = this.newRootTask();
                this.rootTask.addChild(new Task());
                this.settings = Settings;
                
            }
            
            newRootTask(data?:BaseTask):Task{
                var rt = new Task(data);
                rt.isRoot = true;
                var oldName = rt.name;
                var that = this;
                Object.defineProperty(rt,"name",{
                    enumerable:true,
                    get:function(){
                        return this._name;
                    },
                    set:function(val){
                        this._name = val;
                        that.saveFileName = val + ".json";
                    }
                })
                rt.name = oldName;
                return rt;
            }
            
            download(downloadLink){
                downloadLink.href="data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.rootTask, null, 2))
                
            }
            
            fileUploaded({data, fileName}){
                this.rootTask = this.newRootTask(data);
                this.saveFileName = fileName;
            }
            
            
            globalKeyDown(ev){
                if(keys(ev,"ctrl+alt+h")){
                    this.settings.showOtherThings = !this.settings.showOtherThings
                }            
                if(keys(ev,"ctrl+alt+n")){
                    this.settings.showNotes = !this.settings.showNotes
                }            
            }
            
            ngOnChanges(changes){
                console.dir(changes)
            }

}
