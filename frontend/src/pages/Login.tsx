import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../config";
import adminModeStore from "../utils/adminModeStore";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  useEffect(() => {
    setUsernameError("");
    setPasswordError("");
    setMessage("");

    const token = localStorage.getItem("token");

    if (token) {
      adminModeStore.setState({ isAdmin: true });
    }
    //const isAdmin = localStorage.getItem("isAdmin") === "true";
    //adminModeStore.setState({ isAdmin });
  }, []);

  // Sign in button handler.
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //check only if username or password is empty.
    if (!username && !password) {
      setUsernameError("please enter a username");
      setPasswordError("please enter a password");
      return;
    }
    if (!username) {
      setUsernameError("please enter a username");
      return;
    }
    if (!password) {
      setPasswordError("please enter a password");
      return;
    }

    try {
      const response = await axios.post(
        config.baseApiUrl + "/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        adminModeStore.setState({ isAdmin: true });
        setUsernameError("");
        setPasswordError("");
        navigate("/menu");
      } else response.status === 401;
      {
        setMessage("invalid credential");
      }
    } catch (error) {
      setMessage("Login failed: Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center rounded-md">
      <form
        onSubmit={handleLogin}
        className="mx-auto justify-center rounded-lg p-8 px-8"
      >
        <div className="w-96 justify-center rounded-md bg-gray-200 p-10 shadow-lg">
          <div>
            <h3 className="text-center text-4xl font-semibold"> Tea-Rex </h3>
            <input
              className="my-2 w-full border-b border-black bg-transparent py-4 text-black outline-none focus:outline-none "
              type="username"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <div className="mt-3 text-sm text-red-500">{usernameError}</div>
            )}
            <input
              type="password"
              placeholder="password"
              className="my-2 w-full border-x-0 border-b border-t-0 border-black bg-transparent px-0 py-4 text-black ring-0 focus:border-b-black focus:ring-0"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <div className="mt-3 text-sm text-red-500">{passwordError}</div>
            )}
          </div>
          <div className="mt-3 flex">
            <div>
              <a href="#" className="text-xs text-black">
                Forgot Username / Password?
              </a>
            </div>
          </div>
          <div className="mt-5 justify-center">
            <button
              className="w-full rounded-md border-green-500 bg-green-500 px-5 py-1 text-white"
              type="submit"
            >
              Sign In
            </button>
          </div>
          {message && (
            <div className="mt-3 text-sm text-red-500">{message}</div>
          )}
        </div>
      </form>
    </div>
  );
}
export default Login;
