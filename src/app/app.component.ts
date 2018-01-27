import { Component } from '@angular/core';
import {RecordService, SearchRecordRequest} from './services/record.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  private createSearchRequest(): SearchRecordRequest {
    return <SearchRecordRequest>({
      startDate: new Date('2017-01-01'),
      endDate: new Date('2018-01-01'),
      minCount: 0,
      maxCount: 0
    });
  }

  constructor(private _recordService: RecordService){
    const request = this.createSearchRequest();

    _recordService.getRecords(request)
      .subscribe((resp) => console.log('resp ==>', resp), (err) => console.log('err ==>', err));
  }
}
