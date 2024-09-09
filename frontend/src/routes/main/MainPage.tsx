import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LargeButton from "../../components/button/LargeButton";
import PaddingDiv from "../../components/settingdiv/PaddingDiv";
import NormalTitle from "../../components/text/NormalTitle";
import QRFrame from "./component/QRFrame";
import userAPI from "../../api/userAPI";
import axios from "axios";
import { getToken, onMessage } from "firebase/messaging";
import fcmApi from "../../api/fcmAPI";
import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const messaging: Messaging = getMessaging(app);

export default function MainPage() {
  const userservice = new userAPI();
  const fcmservice = new fcmApi();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("익명");
  const [member, setMember] = useState<boolean>(false);

  const getUserInfo = async () => {
    try {
      const response = await userservice.checkMem();

      if (response.status === 200) {
        setName(response.data.userId);
        setMember(response.data.paymentServiceMember);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("에러 발생: " + error);
      }
    }
  };

  const requestFCMToken = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        console.log(token);

        fcmservice.postUserInfo({
          token: token,
        });
      } catch (error) {
        console.error("FCM Token error: ", error);
      }
    } else if (permission === "denied") {
      alert("You denied the notification permission");
    }
  };

  const onMessageListener = () => {
    onMessage(messaging, (payload) => {
      console.log("Message received. Payload:", payload);
    });
  };

  useEffect(() => {
    // 로그인 정보 가져오기
    getUserInfo();
    // requestFCMToken();
    // onMessageListener();
  }, []);

  return (
    <div style={{ backgroundColor: "#9abade33" }}>
      <PaddingDiv>
        <div>
          {!member && (
            <LargeButton
              type="blue"
              disabled={member}
              onClick={() => navigate("/serviceagree")}
            >
              결제 서비스 가입하기
            </LargeButton>
          )}

          <NormalTitle>
            {name}님, QR 코드를 인식해서 빠르게 결제해보세요.
          </NormalTitle>
          <QRFrame member={member}></QRFrame>
        </div>
      </PaddingDiv>
    </div>
  );
}
