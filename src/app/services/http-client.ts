import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class HttpClient {

  private baseEndpoint: string;
  private apiKey: string;

  constructor(private http: Http) {
    this.baseEndpoint = 'https://api.football-data.org/v1/';
    this.apiKey = '5de3bb77944c4645811a6a3260b703fe';
  }

  public get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.baseEndpoint + url, { headers });
  }

  public post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post( this.baseEndpoint + url, data, { headers } );
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append( 'X-Auth-Token', '5de3bb77944c4645811a6a3260b703fe' );
  }
}
