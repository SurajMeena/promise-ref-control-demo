import React, { useState } from "react";
import { dummyAuthClient } from "./dummyAuthClient";

const Login = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [status, setStatus] = useState("");
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
    phoneCode: "",
  });
  const { phoneNumber, password, phoneCode } = loginData;

  const phoneCodePromise = React.useRef();
  const resolvePhoneCode = React.useRef();
  if (!phoneCodePromise.current) {
    phoneCodePromise.current = new Promise((res) => {
      resolvePhoneCode.current = res;
    });
  }

  const handleInputChange = (e) => {
    console.log(e.target.getAttribute("name"), e.target.value);
    setLoginData({
      ...loginData,
      [e.target.getAttribute("name")]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const client = dummyAuthClient;

    try {
      setIsCodeSent(true);
      await client.start({
        phoneNumber: async () => phoneNumber,
        password: async () => password,
        phoneCode: async () => phoneCodePromise.current,
        onError: (err) => {
          setIsCodeSent(false);
          throw err;
        },
      });
      setStatus("You should now be connected.");
      setTimeout(() => setStatus(""), 3000);
      await client.sendMessage("me", { message: "Hello!" });
    } catch (error) {
      console.log(error);
      setStatus(error.message);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div>
      <h2>Telegram Login</h2>
      {!isCodeSent ? (
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => handleInputChange(e)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => handleInputChange(e)}
            />
          </label>
          <button onClick={handleLogin}>Send Code</button>
        </div>
      ) : (
        <div>
          <label>
            Phone Code:
            <input
              type="text"
              name="phoneCode"
              value={phoneCode}
              onChange={(e) => handleInputChange(e)}
            />
          </label>
          <button onClick={() => resolvePhoneCode.current(phoneCode)}>
            Submit OTP
          </button>
        </div>
      )}
      <p>{status}</p>
    </div>
  );
};

export default Login;
