import {Injectable, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {WebsocketResponseModel} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  connection$: WebSocketSubject<any> | null;

  public connect(): Observable<WebsocketResponseModel> {
    if (this.connection$) {
      return this.connection$;
    } else {
      this.connection$ = webSocket(environment.websocket);

      return this.connection$;
    }
  }

  public send(data: any): void {
    if (this.connection$) {
      this.connection$.next(data);
    } else {
      console.error('Error!');
    }
  }

  private closeConnection(): void {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }

  ngOnDestroy(): void {
    this.closeConnection();
  }
}
