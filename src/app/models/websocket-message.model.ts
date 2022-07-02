import {environment} from "../../environments/environment";

export class WebsocketMessageModel {
  type: string;
  apikey: string;
  heartbeat: boolean;
  subscribe_data_type: string[];
  subscribe_filter_symbol_id: string[];

  constructor(dataForSymbol: string) {
    this.type = 'hello';
    this.apikey = environment.api_key;
    this.heartbeat = false;
    this.subscribe_data_type = ['trade'];
    this.subscribe_filter_symbol_id = this.getSymbolStringForSubscribe(dataForSymbol);
  }

  private getSymbolStringForSubscribe(stringForSymbol: string): string[] {
    const splitData: string[] = stringForSymbol.split('/');

    return [`BITSTAMP_SPOT_${splitData[0]}_${splitData[1]}`];
  }
}
