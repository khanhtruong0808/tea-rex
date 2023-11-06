import adminModeStore from "../utils/adminModeStore";
import ownerModeStore from "../utils/ownerModeStore";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the admin mode state
    adminModeStore.setState({ isAdmin: false });
    ownerModeStore.setState({ isOwner: false });
    localStorage.removeItem("token");
    fetch("/logout", {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/Admin");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="absolute right-2 top-28">
      <div className="flex flex-col">
        <div className="z-10">
          <div className="justify-center">
            <button
              onClick={handleLogout}
              className="w-full rounded-md border-red-500 bg-red-500 px-5 py-1 text-white"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutButton;
