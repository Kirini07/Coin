import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {CryptoDataModel, PeriodModel} from "../../models";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoinService {

  constructor(private http: HttpClient) {
  }

  public getPeriodList(): Observable<PeriodModel[]> {
    return this.http.get<PeriodModel[]>(`${environment.coin_api}/exchangerate/history/periods`);
  }

  public getCryptoDataByPeriod(searchingCoin: string, periodId: string): Observable<CryptoDataModel[]> {
    const startDate: Date = new Date();

    startDate.setMonth(startDate.getMonth() - 1);

    return this.http.get<CryptoDataModel[]>(`${environment.coin_api}/exchangerate/${searchingCoin}/history?time_start=${startDate.toISOString()}&period_id=${periodId}`);
  }
}
