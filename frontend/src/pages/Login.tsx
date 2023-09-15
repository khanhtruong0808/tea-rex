import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { config } from "../config";
import adminModeStore from "../utils/adminModeStore";

function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  useEffect(() => {
    setUsernameError('');
    setPasswordError('');
    setMessage('');
  }, [])
  // Sign in button handler. 
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //check only if username or password is empty.
    if(!username && !password){
      setUsernameError('please enter a username');
      setPasswordError('please enter a password');
      return;
    }
    if(!username){
      setUsernameError('please enter a username');
      return;
    }
    if(!password){
      setPasswordError('please enter a password');
      return;
    }
    /*const response = await axios.post(config.baseApiUrl + '/login', {
      headers: 
      {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });*/
    try {
      const response = await axios.post(config.baseApiUrl + '/login', {
        username, // Send username
        password, // Send password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        // if success, redirect to the menu page.
        adminModeStore.setState({isAdmin: true});
        setUsernameError('');
        setPasswordError('');
        navigate('/menu');

      } else if (response.status === 401){
        setMessage('invlaid credential'); 
      }
    } 
    catch (error) {
      setMessage('Login failed: Invalid credentials');
    }
  };
  return (
    <div className="flex items-center h-screen rounded-md justify-center">
      <form onSubmit={handleLogin} className="mx-auto p-8 px-8 rounded-lg justify-center">
        <div className="w-96 p-10 shadow-lg bg-gray-200 rounded-md justify-center">
          <div>
            <h3 className="text-4xl font-semibold text-center"> Tea-Rex </h3>
            <input
              className="w-full text-black my-2 py-4 bg-transparent border-b border-black outline-none focus:outline-none "
              type="username"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && (
            <div className="mt-3 text-red-500 text-sm">
              {usernameError}
            </div>
          )}
            <input
              type="password"
              placeholder="password"
              className="w-full text-black my-2 py-4 bg-transparent border-b border-black outline-none focus:outline-none"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
            <div className="mt-3 text-red-500 text-sm">
              {passwordError}
            </div>
          )}
          </div>
          <div className="mt-3 flex">
            <div>
              <a href="#" className="text-black text-xs">
                Forgot Username / Password?
              </a>
            </div>
          </div>
          <div className="mt-5 justify-center">
            <button
              className="w-full border-green-500 bg-green-500 text-white py-1 px-5 rounded-md"
              type="submit"
            >
              Sign In
            </button>
          </div>
          {message && (
            <div className="mt-3 text-red-500 text-sm">
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
export default Login;
