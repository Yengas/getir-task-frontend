import {Component, OnInit} from '@angular/core';
import {RecordService, SearchRecordRequest} from '../../services/record.service';
import { Record } from '../../models/Record.model';
import { LocalDataSource } from 'ng2-smart-table';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/share';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  providers: [ RecordService ]
})
export class ListingComponent implements OnInit {
  private _filter$: ReplaySubject<any> = new ReplaySubject<any>();
  filters: any = {};

  data: LocalDataSource = new LocalDataSource([]);
  settings: any = {
    columns: {
      id: {title: 'ID'},
      date: {title: 'Created At'},
      count: {title: 'Total Count'}
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
  };

  errorMessage = '';

  /**
   * Given a record service record, creates a entry to show in the data table.
   */
  private static mapRecordToTableObject(record: Record) {
    return {
      id: record._id.key,
      date: record._id.createdAt.toISOString(),
      count: record.totalCount
    };
  }

  /**
   * Given the filters used in this component, creates search record request.
   */
  private static mapFiltersToRecordRequest(filters: any): SearchRecordRequest{
    const {
      minCount,
      maxCount,
    } = filters;

    const {
      beginDate: { year: byear, month: bmonth, day: bday },
      endDate: { year: eyear, month: emonth, day: eday } ,
    } = {
      ...{ beginDate: (filters.range && filters.range.beginDate ? filters.range.beginDate : { year: -1, month: -1, day: -1})},
      ...{ endDate: (filters.range && filters.range.endDate ? filters.range.endDate : { year: -1, month: -1, day: -1})},
    };

    return <SearchRecordRequest>{
      minCount,
      maxCount,
      startDate: new Date(Date.UTC(byear, bmonth - 1, bday)),
      endDate: new Date(Date.UTC(eyear, emonth - 1, eday)),
    };
  }

  /**
   * For given key, tries to parse the data. parseInt may throw, call this function in observables.
   */
  private static parseFilter(key, data) {
    if (key === 'range') {
      return { beginDate: data.beginDate, endDate: data.endDate };
    } else if (key === 'minCount' || key === 'maxCount') {
      return parseInt(data, 10);
    }

    return null;
  }

  constructor(private _recordService: RecordService) {
    // hot observable of filter parameters.
    const filterStream = this._filter$.asObservable()
      .startWith({
        minCount: 0,
        maxCount: 0,
        range: { beginDate: { year: 2017, month: 1, day: 1 }, endDate: { year: 2018, month: 1, day: 1 }}
      })
      .debounceTime(1000)
      .share();

    filterStream
      // only if the filters have changed.
      .filter((newFilters) => JSON.stringify(newFilters) !== JSON.stringify(this.filters))
      // For each filter request with 1s debounce...
      .forEach((filters) => {
        // set the new filters as the one to be requested
        this.filters = filters;
        // clear request error
        this.showRequestError({});

        // create a service request and subscribe to it to show the result.
        _recordService.getRecords(ListingComponent.mapFiltersToRecordRequest(filters))
          // stop if we get another filter request.
          .takeUntil(filterStream)
          .subscribe(
            (records) => this.data = new LocalDataSource(records.map(ListingComponent.mapRecordToTableObject)),
            (err) => this.showRequestError(err)
          );
      });
  }

  showRequestError(err){
    this.errorMessage = err.message || '';
  }

  /**
   * Tries to change the filter's given key with the given data.
   * Will trigger next or error on this._filter$
   * @param {string} key
   * @param data
   */
  onFilterChange(key: string, data) {
    Observable.of(null)
      .map((_) => ListingComponent.parseFilter(key, data))
      .map((value) => ({ ...this.filters, [key]: value }))
      .subscribe(
        (filters) => {
          this._filter$.next(filters);
        },
        (err) => {
          this._filter$.error(err);
        }
      );
  }

  ngOnInit() {}

}
