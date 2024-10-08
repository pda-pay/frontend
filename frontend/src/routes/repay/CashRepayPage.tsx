import { useEffect, useState } from "react";
import BackgroundFrame from "../../components/backgroundframe/BackgroundFrame";
import PaddingDiv from "../../components/settingdiv/PaddingDiv";
import BoldTitle from "../../components/text/BoldTitle";
import paymentAPI from "../../api/paymentAPI";
import NormalTitle from "../../components/text/NormalTitle";
import ButtonBar from "../../components/button/ButtonBar";
import AlertMortgagedRepayModal from "./component/AlertMortgagedRepayModal";

export default function CashRepayPage() {
  const repayservice = new paymentAPI();

  const today = new Date();

  const [companyName, setCompanyName] = useState<string>("신한은행");
  const [accountNumber, setAccountNumber] = useState<string>("0000-0000");
  const [accountMoney, setAccountMoney] = useState<number>(1000000);
  const [repaymentDate, setRepaymentDate] = useState<number>(1);
  const [previousMonthDebt, setPreviousMonthDebt] = useState<number>(0);
  const [currentMonthDebt, setCurrentMonthDebt] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(
    (today.getMonth() + 1) % 12
  );
  const [previousMonth, setPreviousMonth] = useState<number>(0);
  const [totalDebt, setTotalDebt] = useState<number>(0);

  useEffect(() => {
    setCurrentMonth((today.getMonth() + 1) % 12);
  }, []);

  const [inputValue, setInputValue] = useState<string>("");
  const [errInput, setErrInput] = useState<boolean>(true);
  const [repayAmount, setRepayAmount] = useState<number>(0);

  useEffect(() => {
    if (currentMonth !== 1) {
      setPreviousMonth(currentMonth - 1);
    } else setPreviousMonth(12);
  }, []);

  const getAccountInfo = async () => {
    try {
      const response = await repayservice.getRepayAccount();

      if (response.status === 200) {
        setCompanyName(response.data.accountName);
        setAccountNumber(response.data.accountNumber);
        setAccountMoney(response.data.accountDeposit);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRepayAmount = async () => {
    try {
      const response = await repayservice.getRepayAmount();

      if (response.status === 200) {
        setRepaymentDate(response.data.repaymentDate);
        setPreviousMonthDebt(response.data.previousMonthDebt);
        setCurrentMonthDebt(response.data.currentMonthDebt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const postCashRepayAmount = async (): Promise<boolean> => {
    try {
      const temp = { amount: repayAmount };
      const response = await repayservice.postCashRepayAmount(temp);

      if (response.status === 200) {
        openAlert();
        return false;
      } else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    getAccountInfo();
    getRepayAmount();
  }, []);

  useEffect(() => {
    setTotalDebt(previousMonthDebt + currentMonthDebt);
  }, [previousMonthDebt, currentMonthDebt]);

  const validateInput = (ip: number) => {
    if (ip > accountMoney || ip > totalDebt || ip <= 0) {
      setErrInput(true);
    } else {
      setRepayAmount(ip);
      setErrInput(false);
    }
  };

  const handleTempSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const valueToNum = Number(value);

    if (value === "" || !isNaN(Number(value))) {
      setInputValue(value);
      validateInput(valueToNum);
    }
  };

  return (
    <PaddingDiv>
      <BoldTitle>즉시 상환 하기</BoldTitle>
      <BackgroundFrame color="blue">
        <div>140pay 결제일 {repaymentDate}일</div>
        <div>
          {companyName} {accountNumber}
        </div>
        <div>계좌 잔고: {accountMoney.toLocaleString()}원</div>
      </BackgroundFrame>
      <div>
        <NormalTitle marginBottom="5px">결제 예정 금액</NormalTitle>
        <BackgroundFrame color="blue">
          <div>{totalDebt.toLocaleString()}원</div>
          <div>
            {previousMonth === 12 ? (
              <span>{today.getFullYear() - 1}</span>
            ) : (
              <span>{today.getFullYear()}</span>
            )}
            년 {previousMonth}월 결제 {previousMonthDebt.toLocaleString()}원
          </div>
          <div>
            {today.getFullYear()}년 {currentMonth}월 결제{" "}
            {currentMonthDebt.toLocaleString()}원
          </div>
        </BackgroundFrame>
      </div>

      <div>
        <NormalTitle marginBottom="5px">결제할 금액 입력</NormalTitle>
        <BackgroundFrame color="blue">
          <label className="block">
            {/* <span className="text-sm text-gray-400">
            최대 {accountMoney.toLocaleString()}원 입력 가능합니다.
          </span> */}
            <input
              type="number"
              name="repay"
              value={inputValue}
              onChange={handleTempSelected}
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            />
            {errInput && inputValue.length > 0 && (
              <p className="mt-2 text-sm text-red-600">
                {"계좌 잔액, 결제 예정 금액 이하로 입력해주세요."}
              </p>
            )}
          </label>
        </BackgroundFrame>
      </div>

      <div className="mt-auto">
        <ButtonBar
          beforetext="취소"
          beforeurl="/payment"
          nexttext="상환하기"
          nexturl="/payment"
          nextdisabled={errInput}
          nextOnClick={postCashRepayAmount}
        />
      </div>
      {isAlertOpen && (
        <AlertMortgagedRepayModal
          isAlertOpen={isAlertOpen}
          handleCloseAlert={closeAlert}
        />
      )}
    </PaddingDiv>
  );
}
