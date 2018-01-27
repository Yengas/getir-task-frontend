import { Component } from '@angular/core';
import {RecordService, SearchRecordRequest} from './services/record.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'app';

  constructor(private _recordService: RecordService){
  }
}
