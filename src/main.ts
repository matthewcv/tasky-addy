import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './components/app';

bootstrap(AppComponent);


export var Settings = {
    showOtherThings : false,
    showNotes : true
}

export interface ISettings {
    showOtherThings : boolean,
    showNotes : boolean
}