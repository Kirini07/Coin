import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {MessageService} from "primeng/api";
import {Messages} from "../../assets/messages";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpRequest = request.clone({
      headers: request.headers.set('X-CoinAPI-Key', environment.api_key),
    })

    return next.handle(httpRequest).pipe(
      tap((event: HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log('Done')
          }
        }, (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status == 401) {
              this.messageService.add({
                severity: 'error',
                summary: Messages.error,
                detail: Messages.api_key_error,
              })
            }
          }
        }
      )
    )
  }
}
