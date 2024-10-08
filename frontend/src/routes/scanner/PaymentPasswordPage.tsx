import { useEffect, useState } from "react";
import PaddingDiv from "../../components/settingdiv/PaddingDiv";
import BeatLoaderDiv from "../../components/spinner/BeatLoaderDiv";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PinInput from "react-pin-input";
import transactionAPI from "../../api/transactionAPI";
import axios from "axios";

export default function PaymentPasswordPage() {
  const [password, setPassword] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const service = new transactionAPI();

  const getToken = async () => {
    try {
      const result = await service.getToken({
        paymentPassword: password,
      });
      navigate("/scanner", { state: result.data });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: `<span style="font-size: 20px; font-weight : bolder;">결제 서비스가 차단되어있습니다.</span>`,
            confirmButtonColor: "blue",
          });
          navigate("/main");
        }

        console.log(err);
        Swal.fire({
          icon: "warning",
          title: `<span style="font-size: 20px; font-weight : bolder;">잘못된 비밀번호입니다</span>`,
          confirmButtonColor: "blue",
        });
      }
    }
  };

  useEffect(() => {
    const cookie = document.cookie;
    console.log(cookie);
  }, []);

  useEffect(() => {
    if (password?.length < 6) return;

    setLoading(true);
    getToken();
    setLoading(false);
  }, [password]);

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  return (
    <>
      {isLoading && <BeatLoaderDiv />}
      <PaddingDiv>
        <div className="flex justify-between flex-col h-[40vh] items-center">
          <p className="cursor-default mt-16 text-xl text-center font-bold">
            결제 비밀번호 6자리를 입력해주세요.
          </p>
          <PinInput
            length={6}
            initialValue=""
            secret={true}
            focus={true}
            type="numeric"
            autoSelect={true}
            inputMode="numeric"
            onChange={handlePassword}
          />
        </div>
      </PaddingDiv>
    </>
  );
}
