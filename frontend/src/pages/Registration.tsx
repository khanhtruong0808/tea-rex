import React from "react";
import { Link } from "react-router-dom";

interface IProps {}

interface IState {
  username: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
}

class Registration extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
    };
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({ confirmPassword: event.target.value });
  };
  toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    if (password != confirmPassword) {
      alert("Passwords does not match, please try again.");
    } else {
      alert("Thank you for registrating!");
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    this.setState({ username: "", password: "", confirmPassword: "" });
  };

  render() {
    return (
      <div className="flex h-screen items-center justify-center rounded-md">
        <form
          onSubmit={this.handleSubmit}
          className="mx-auto justify-center rounded-lg p-8 px-8"
        >
          <div className="w-96 justify-center rounded-md bg-gray-200 p-10 shadow-lg">
            <div>
              <h3 className="text-center text-4xl font-semibold">Welcome!!!</h3>
              <div>
                <input
                  className="my-2 w-full border-b border-black bg-transparent py-4 text-black outline-none focus:outline-none"
                  type="username"
                  placeholder="username"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
              </div>
              <div>
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  placeholder="password"
                  className="my-2 w-full border-b border-black bg-transparent py-4 text-black outline-none focus:outline-none"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={this.toggleShowPassword}>
                  {this.state.showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div>
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  placeholder="confirm password"
                  className="my-2 w-full border-b border-black bg-transparent py-4 text-black outline-none focus:outline-none"
                  value={this.state.confirmPassword}
                  onChange={this.handleConfirmPasswordChange}
                />
                <button type="button" onClick={this.toggleShowPassword}>
                  {this.state.showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="mt-5 justify-center">
              <button
                className="w-full rounded-md border-green-500 bg-green-500 px-5 py-1 text-white"
                type="submit"
              >
                Register
              </button>
            </div>
            <div className="mt-3 flex justify-center">
              <div>
                Already have an account?{" "}
                <Link to="/Admin" className="text-green-500 underline">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Registration;
