import BaseApi from "./axiosInstance";

export interface CashRepayReqData {
  amount: number;
}

export interface MortgagedRepayReqData {
  repaymentAmount: number;
  selectedStocks: {
    stockRank: number;
    quantity: number;
    accountNumber: string;
    stockCode: string;
  }[];
}

export default class paymentAPI extends BaseApi {
  async getPaymentInfo(/*data: HistoryReqData*/) {
    const resp = await this.fetcher.get("/payment/cash-info");
    return resp;
  }

  async getPaymentHistory(y: number, m: number) {
    const resp = await this.fetcher.get(
      `/payment/history?year=${y}&month=${m}`
    );
    return resp;
  }

  //연결 계좌 정보 가져오기
  async getRepayAccount() {
    const resp = await this.fetcher.get("/payment/accounts");
    return resp;
  }

  //예정 결제 금액 가져오기
  async getRepayAmount() {
    const resp = await this.fetcher.get("/payment/amount");
    return resp;
  }

  //상환 금액 보내기
  async postCashRepayAmount(data: CashRepayReqData) {
    const resp = await this.fetcher.post("/payment/cash", data);
    return resp;
  }

  //담보 주식 가져오기
  async getMortgagedStock() {
    const resp = await this.fetcher.get("/payment/pawn-info");
    return resp;
  }

  //담보로 상환하기
  async postMortgagedRepay(data: MortgagedRepayReqData) {
    const resp = await this.fetcher.post("/payment/pawn", data);
    return resp;
  }
}
