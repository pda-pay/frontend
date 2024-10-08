import { useEffect, useState } from "react";
import PaddingDiv from "../../components/settingdiv/PaddingDiv";
import NormalTitle from "../../components/text/NormalTitle";
import ButtonBar from "../../components/button/ButtonBar";
import { IoAddCircle } from "react-icons/io5";
import PriorityFrame from "./component/PriorityFrame";
import SetPriorityModal from "./component/SetPriorityModal";
import payServiceAPI from "../../api/payServiceAPI";
import axios from "axios";
import userAPI from "../../api/userAPI";
import { useLocation } from "react-router-dom";
import AlertPriorityModal from "./component/AlertPriorityModal";

type mortgagedObject = {
  accountNumber: string;
  quantity: number;
  stockCode: string;
  stockName: string;
  companyCode: string;
  companyName: string;
  stabilityLevel: number;
  stockPrice: number;
  limitPrice: number;
};

type priorityObject = {
  accountNumber: string;
  quantity: number;
  stockCode: string;
  stockName: string;
  stockRank: number;
  companyCode: string;
  companyName: string;
  stabilityLevel: number;
  stockPrice: number;
  limitPrice: number;
};

export default function PriorityPage() {
  const payjoinservice = new payServiceAPI();
  const userservice = new userAPI();

  const location = useLocation();
  // 전달된 state를 받아옵니다. (default 값을 false로 설정)
  const { menu } = location.state || { menu: false };

  const [mem, setMem] = useState<boolean>(false);

  //담보잡은 주식, length: 9
  //0: 계좌번호, 1: 담보주수, 2: 종목코드, 3: 종목명, 4: 증권사코드, 5: 증권사명, 6: 위험도, 7: 전일종가, 8: 한도
  const [selectedStock, setSelectedStock] = useState<
    [string, number, string, string, string, string, number, number, number][]
  >([]);

  //우선순위가 있는 주식, length: 10
  //0: 계좌번호, 1: 담보잡은주수, 2: 종목코드, 3: 종목명, 4: 우선순위, 5: 증권사코드, 6: 증권사명, 7: 위험도, 8: 전일종가, 9: 한도
  const [priority, setPriority] = useState<
    [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ][]
  >([]);

  //length: 10
  //0: 계좌번호, 1: 남은주수, 2: 종목코드, 3: 종목명, 4: 우선순위, 5: 증권사코드, 6: 증권사명, 7: 위험도, 8: 전일종가, 9: 한도
  const [unPriority, setUnPriority] = useState<
    [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ][]
  >([]);

  const getMem = async () => {
    try {
      const response = await userservice.checkMem();

      if (response.status === 200) {
        setMem(response.data.paymentServiceMember);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMem();
  }, []);

  const getPriority = async () => {
    try {
      const response = await payjoinservice.getPriorityStock();

      if (response.status === 200) {
        const mStock = response.data.mortgagedStocks;

        const pStock = response.data.stockPriorities;

        beginningSetting(mStock, pStock);
      } else {
        console.log("우선순위 페이지 get 요청 실패");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.log("우선순위 get 요청 에러 발생: " + error);
        }
      }
    }
  };

  const beginningSetting = async (
    mStock: mortgagedObject[],
    pStock: priorityObject[]
  ) => {
    saveMortgagedStock(mStock);
    savePriorityStock(pStock);
  };

  const saveMortgagedStock = (mStock: mortgagedObject[]) => {
    const temp: [
      string,
      number,
      string,
      string,
      string,
      string,
      number,
      number,
      number
    ][] = mStock.map((item) => [
      item.accountNumber,
      item.quantity,
      item.stockCode,
      item.stockName,
      item.companyCode,
      item.companyName,
      item.stabilityLevel,
      item.stockPrice,
      item.limitPrice,
    ]);

    setSelectedStock([...temp]);
  };

  const savePriorityStock = (pStock: priorityObject[]) => {
    const temp: [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ][] = pStock.map((item) => [
      item.accountNumber,
      item.quantity,
      item.stockCode,
      item.stockName,
      item.stockRank,
      item.companyCode,
      item.companyName,
      item.stabilityLevel,
      item.stockPrice,
      item.limitPrice,
    ]);

    setPriority([...temp]);
  };

  const settingUnPriority = () => {
    const temp: [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ][] = [];

    selectedStock.forEach((rowA) => {
      // 우선 배열에 일치하는 행이 있는지 검사
      const isMatch = priority.some(
        (rowB) => rowA[0] === rowB[0] && rowA[2] === rowB[2]
      );

      //일치하는 행이 존재하면,
      if (isMatch) {
        let count: number = 0;
        priority.map((row, index) => {
          if (rowA[0] === row[0] && rowA[2] === row[2]) {
            count += row[1];
          }
          if (index === priority.length - 1 && count < rowA[1]) {
            temp.push([
              rowA[0],
              rowA[1] - count,
              rowA[2],
              rowA[3],
              0,
              rowA[4],
              rowA[5],
              rowA[6],
              rowA[7],
              rowA[8],
            ]);
          }
        });
      }

      if (!isMatch) {
        temp.push([
          rowA[0],
          rowA[1],
          rowA[2],
          rowA[3],
          0,
          rowA[4],
          rowA[5],
          rowA[6],
          rowA[7],
          rowA[8],
        ]);
      }
    });

    setUnPriority([...temp]);
  };

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const putPriority = async (): Promise<boolean> => {
    try {
      const temp = makePriorityReqData();
      const response = await payjoinservice.putPriorityStock(temp);

      if (response.status === 200) {
        if (mem && menu) {
          openAlert();
          return false;
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.log("우선 순위 put 요청 에러 발생: " + error);
        }
      }
      return false;
    }
  };

  useEffect(() => {
    getPriority();
  }, []);

  useEffect(() => {
    settingUnPriority();
  }, [priority]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  let limit: number = 0;
  if (selectedStock !== undefined)
    for (let i = 0; i < selectedStock.length; i++) {
      limit += selectedStock[i][1] * selectedStock[i][8];
    }

  const addPriority = (
    clickedRow: [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ],
    value: number
  ) => {
    if (value > 0) {
      const changedArr: [
        string,
        number,
        string,
        string,
        number,
        string,
        string,
        number,
        number,
        number
      ][] = unPriority.map((row) => {
        if (clickedRow[0] === row[0] && clickedRow[2] === row[2]) {
          return [
            row[0],
            row[1] - value,
            row[2],
            row[3],
            row[4],
            row[5],
            row[6],
            row[7],
            row[8],
            row[9],
          ];
        }
        return row;
      });

      // unpriority 업데이트
      setUnPriority(changedArr.filter((row) => row[1] !== 0));

      //priority에 추가
      const addRow: [
        string,
        number,
        string,
        string,
        number,
        string,
        string,
        number,
        number,
        number
      ] = [
        clickedRow[0],
        value,
        clickedRow[2],
        clickedRow[3],
        clickedRow[4],
        clickedRow[5],
        clickedRow[6],
        clickedRow[7],
        clickedRow[8],
        clickedRow[9],
      ];

      setPriority([...priority, addRow]);
    }
  };

  const deletePriority = (
    rowIndex: number,
    clickedRow: [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ]
  ) => {
    //지울 종목
    const tempRow: [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ] = clickedRow;

    const newUnPri: [
      string,
      number,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
      number
    ][] = [...unPriority];

    if (unPriority.length === 0) {
      newUnPri.push([...tempRow]);
    } else {
      unPriority.map((row, index) => {
        if (row[0] === tempRow[0] && row[2] === tempRow[2]) {
          newUnPri[index][1] = unPriority[index][1] + tempRow[1];
        } else if (index === unPriority.length - 1) {
          newUnPri.push([...tempRow]);
        }
      });
    }

    setUnPriority(newUnPri);

    const newPriority = priority.filter((_, index) => rowIndex !== index);
    setPriority(newPriority);
  };

  const makePriorityReqData = () => {
    return {
      stockPriorities: priority.map(
        (
          stock: [
            string,
            number,
            string,
            string,
            number,
            string,
            string,
            number,
            number,
            number
          ],
          index
        ) => ({
          //0: 계좌번호, 1: 담보잡은주수, 2: 종목코드, 3: 종목명, 4: 우선순위,
          // 5: 증권사코드, 6: 증권사명, 7: 위험도, 8: 전일종가, 9: 한도

          accountNumber: stock[0],
          quantity: stock[1],
          stockCode: stock[2],
          stockName: stock[3],
          stockRank: index + 1,
          companyCode: stock[5],
          companyName: stock[6],
          stabilityLevel: stock[7],
          stockPrice: stock[8],
          limitPrice: stock[9],
        })
      ),
    };
  };

  return (
    <PaddingDiv>
      <div>
        <NormalTitle>
          현재 확보한 총 한도는
          <span className="font-bold text-blue-700">
            {limit.toLocaleString()}원
          </span>
          입니다.
        </NormalTitle>
        <div className="text-sm	text-gray-400 cursor-default">
          + 버튼을 통해 반대매매 시 우선으로 처리할 증권을 추가해보세요.
        </div>
        <div className="flex justify-center">
          <IoAddCircle
            className="size-32 text-gray-400 cursor-pointer"
            onClick={openModal}
          />
        </div>
      </div>

      <PriorityFrame
        priority={priority}
        unPriority={unPriority}
        deletePriority={deletePriority}
      />

      <div className="mt-auto">
        {mem ? (
          <div>
            {menu ? (
              <ButtonBar
                beforetext="이전"
                nexttext="수정 완료"
                beforeurl="/allmenu"
                nexturl="/allmenu"
                nextOnClick={putPriority}
              />
            ) : (
              <ButtonBar
                beforetext="이전"
                nexttext="다음"
                beforeurl="/stock"
                nexturl="/limit"
                nextOnClick={putPriority}
              />
            )}
          </div>
        ) : (
          <ButtonBar
            beforetext="이전"
            nexttext="완료"
            beforeurl="/stock"
            nexturl="/limit"
            nextOnClick={putPriority}
          />
        )}
      </div>
      {isAlertOpen && (
        <AlertPriorityModal
          isAlertOpen={isAlertOpen}
          handleCloseAlert={closeAlert}
        />
      )}

      {isModalOpen && (
        <SetPriorityModal
          unPriority={unPriority}
          isModalOpen={isModalOpen}
          handleCloseModal={closeModal}
          addPriority={addPriority}
        />
      )}
    </PaddingDiv>
  );
}
