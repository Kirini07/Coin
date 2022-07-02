import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {SelectButtonModule} from "primeng/selectbutton";
import {AppComponent} from './app.component';
import {ApiKeyInterceptor} from "./helpers/interceptor";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ProgressBarModule} from "primeng/progressbar";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ChartModule,
    SelectButtonModule,
    FormsModule,
    ToastModule,
    ProgressBarModule,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiKeyInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
