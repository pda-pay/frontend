import { useEffect, useState } from "react";

interface LoginProps {
  handleLoginId: (value: string | undefined) => void;
  handlePWD: (value: string | undefined) => void;
}

export default function LoginInput({ handleLoginId, handlePWD }: LoginProps) {
  const [userId, setUserId] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    handleLoginId(userId);
  }, [userId]);

  useEffect(() => {
    handlePWD(password);
  }, [password]);

  return (
    <div className="flex flex-col gap-10">
      <label className="block">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
          아이디를 입력해주세요.
        </span>
        <input
          type="text"
          name="userId"
          value={userId}
          onChange={handleUserId}
          className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="shinhan"
        />
      </label>

      <label className="block">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
          비밀번호를 입력해주세요.
        </span>
        <input
          type="password"
          // inputmode="numeric"
          name="password"
          value={password}
          onChange={handlePassword}
          className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
        />
      </label>
    </div>
  );
}
