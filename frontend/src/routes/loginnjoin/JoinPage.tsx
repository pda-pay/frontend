import { useState } from "react";
import PaddingDiv from "../../components/settingdiv/PaddingDiv";
import BoldTitle from "../../components/text/BoldTitle";
import JoinButtonbar from "./component/JoinButtonbar";
import JoinInput from "./component/JoinInput";

export default function JoinPage() {
  const [userInfo, setUserInfo] = useState<string[]>(["", "", "", ""]);
  const handleUserInfo = (index: number, value: string) => {
    setUserInfo([
      ...userInfo.slice(0, index),
      value,
      ...userInfo.slice(index + 1),
    ]);
  };

  const [isButtonValid, setIsButtonUnValid] = useState<boolean>(false);

  const handleValidChange = (isValid: boolean) => {
    setIsButtonUnValid(isValid);
  };

  return (
    <PaddingDiv>
      <div>
        <BoldTitle>안녕하세요!</BoldTitle>
      </div>
      <JoinInput
        onValidChange={handleValidChange}
        handleUserInfo={handleUserInfo}
      />
      <JoinButtonbar unValid={!isButtonValid} userInfo={userInfo} />
    </PaddingDiv>
  );
}
