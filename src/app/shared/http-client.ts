import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class HttpClient {

  constructor(private http: Http) {}

  public get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, { headers });
  }

  public post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, { headers });
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append( 'X-Auth-Token', '5de3bb77944c4645811a6a3260b703fe' );
  }
}
