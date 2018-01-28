import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Record } from '../models/Record.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

class RecordResponse{
  code: number;
  message: string;
  records?: Array<Record>;
}

export class SearchRecordRequest {
  startDate: Date;
  endDate: Date;
  minCount: number;
  maxCount: number;
}

/**
 * Given a search request class, converts it to a javascript object that maybe sent as a request to searchRecords endpoint.
 * @param {SearchRecordRequest} request
 * @return {any}
 */
function objectifySearchRecordRequest(request: SearchRecordRequest): any {
  const { startDate, endDate, minCount, maxCount } = request;

  if (isNaN(startDate.getTime())) {
    throw new Error('Start date cant be invalid.');
  } else if (isNaN(endDate.getTime())) {
      throw new Error('End date cant be invalid.');
  } else if (startDate.getTime() > endDate.getTime()) {
    throw new Error('Start date cant be greater than end date!');
  } else if (minCount == null || minCount.constructor !== Number || isNaN(minCount)) {
    throw new Error('Min count should be a valid number.');
  } else if (maxCount == null || maxCount.constructor !== Number || isNaN(maxCount)) {
    throw new Error('Max count should be a valid number.');
  } else if (minCount > maxCount) {
    throw new Error('Min count cant be greater than max count!');
  }

  return {
    startDate: startDate.toISOString().substring(0, 10),
    endDate: endDate.toISOString().substring(0, 10),
    minCount,
    maxCount
  };
}

/**
 * Parse record response given an object. Throws on unknown response type.
 * @param resp
 */
function parseRecordResponse(resp: RecordResponse): Array<Record> {
  if (resp.code !== 0 || !resp.records) {
    if (resp.message) {
      throw new Error(resp.message);
    } else {
      throw new Error('Unknown response');
    }
  }

  return resp.records
    .map(record => ({...record, _id: { ...record._id, createdAt: new Date(record._id.createdAt) }}));
}

@Injectable()
export class RecordService {

  constructor(private http$: HttpClient) { }

  /**
   * A helper function to post json data to given path on geir-bitaksi-hackathon app.
   * @param {string} path
   * @param body
   * @return {Observable<any>}
   */
  private postJson<T>(path: string, body: any): Observable<T> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http$.post<T>(`https://getir-bitaksi-hackathon.herokuapp.com/${path}`, body, { headers });
  }

  /**
   * Search records given constraints on how to filter.
   * @param {SearchRecordRequest} request
   * @return {Observable<Record>}
   */
  getRecords(request: SearchRecordRequest): Observable<Array<Record>> {
    return Observable.of(request)
      .map(objectifySearchRecordRequest)
      .mergeMap((body) => this.postJson<RecordResponse>('searchRecords', body))
      .map(parseRecordResponse);
  }

}
