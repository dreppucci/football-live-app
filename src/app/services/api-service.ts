import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {

  private baseEndpoint: string;
  private apiKey: string;

  constructor(private http: Http) {
    this.baseEndpoint = 'https://api.football-data.org/v1/';
    this.apiKey = '5de3bb77944c4645811a6a3260b703fe';
  }

  public getUrl(url: string) {
    let headers = new Headers();
    headers.append( 'X-Auth-Token', '5de3bb77944c4645811a6a3260b703fe' );

    let requestOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: this.baseEndpoint + url,
      headers,
      body: ''
    });

    return this.http
      .request(new Request(requestOptions))
      .map((res: Response) => {
        return res;
      });
    }
}
