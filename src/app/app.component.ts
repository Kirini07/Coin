import {Component, OnInit} from '@angular/core';
import {concatMap, delay, finalize, map, retryWhen, takeUntil, tap} from "rxjs/operators";
import {iif, Observable, of, Subject, throwError} from "rxjs";
import * as moment from "moment";
import {MessageService} from "primeng/api";
import {CryptoDataModel, PeriodModel, WebsocketResponseModel, WebsocketMessageModel} from "./models";
import {CoinService, WebsocketService} from "./services";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public readonly basicOptions: any = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: true,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 12,
        boxPadding: 5,
        callbacks: {
          title: (context: any) => {
            return `${this.searchingCoin} - ${context[0].label}`
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#222222'
        }
      },
      y: {
        ticks: {
          color: '#222222'
        },
        grid: {
          color: 'rgba(34,34,34,0.15)'
        }
      }
    },
    pointRadius: 5,
    pointHoverRadius: 8,
  };
  public loadSubscribe: boolean = false;
  public periodTypeList: PeriodModel[];
  public selectedPeriod: PeriodModel;
  public searchingCoin: string = '';
  public historyData: any = {
    labels: [],
    datasets: [{
      data: [],
      borderColor: '#4f46e5',
      pointBackgroundColor: '#4f46e5'
    }]
  };
  public marketData: WebsocketResponseModel;
  private destroyed$: Subject<void> = new Subject();

  constructor(private coinService: CoinService,
              private messageService: MessageService,
              private websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.connectToWebsocketServer();
    this.getPeriodListFromService();
  }

  sendMessage() {
    this.websocketService.send(new WebsocketMessageModel(this.searchingCoin));
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  public subscribeToCrypto(): void {
    this.loadSubscribe = true;

    this.getHistoryDataList();
  }

  public changePeriod(period: PeriodModel): void {
    if (this.selectedPeriod.period_id !== period.period_id) {
      this.selectedPeriod = period;

      this.getHistoryDataList();
    }
  }

  private connectToWebsocketServer(): void {
    this.websocketService.connect().pipe(
      retryWhen((errors: Observable<any>) => errors.pipe(
        concatMap((e: any, i: number) => {
          return iif(
            () => {
              return i >= environment.max_attempts - 1;
            },
            throwError(e),
            of(e).pipe(delay(environment.retry_delay))
          )
        })
      )),
      takeUntil(this.destroyed$)
    ).subscribe((response: WebsocketResponseModel) => {
      this.marketData = response;
    });
  }

  private getPeriodListFromService(): void {
    this.coinService.getPeriodList().pipe(
      map((list: PeriodModel[]) => list.filter((period: PeriodModel) => environment.accepted_period.includes(period.unit_name))),
    ).subscribe((periodsResult: PeriodModel[]) => {
      this.periodTypeList = periodsResult;
      this.selectedPeriod = periodsResult[0];
    }, (error) => console.log(error));
  }

  private getHistoryDataList(): void {
    this.coinService.getCryptoDataByPeriod(this.searchingCoin.toUpperCase(), this.selectedPeriod.period_id)
      .pipe(
        finalize(() => this.loadSubscribe = false),
        tap(() => {
          this.sendMessage()
        })
      )
      .subscribe((dataList: CryptoDataModel[]) => {
        const newHistoryData = JSON.parse(JSON.stringify(this.historyData));
        newHistoryData.labels = [];
        newHistoryData.datasets[0].data = [];

        dataList.forEach((data: CryptoDataModel) => {
          newHistoryData.labels.push(moment(data.time_period_start).format('DD.MM'));
          newHistoryData.datasets[0].data.push(data.rate_open);
        })

        this.historyData = newHistoryData;
      })
  }
}
