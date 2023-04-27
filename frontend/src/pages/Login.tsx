import React from 'react';
import {Navigate } from 'react-router-dom';

interface IState {
  username: string;
  password: string;
}

class Admin extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.username === 'Tearex' && this.state.password === 'password') {
        alert('Thank you for Signing in!');
    } else {
        alert('Please enter the correct username and password');
    }

    this.setState({ username: '', password: '' });
  };

  render() {
    return (
      <div className="flex items-center h-screen rounded-md justify-center">
        <form onSubmit={this.handleSubmit} className="mx-auto p-8 px-8 rounded-lg justify-center">
          <div className="w-96 p-10 shadow-lg bg-gray-200 rounded-md justify-center">
            <div>
              <h3 className="text-4xl font-semibold text-center"> Tea-Rex </h3>
              <div>
                <input
                  className="w-full text-black my-2 py-4 bg-transparent border-b border-black outline-none focus:outline-none "
                  type="username"
                  placeholder="username"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="password"
                  className="w-full text-black my-2 py-4 bg-transparent border-b border-black outline-none focus:outline-none"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </div>
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
          </div>
        </form>
      </div>
    );
  }
}

export default Admin;
  