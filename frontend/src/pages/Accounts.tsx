import { TbTrash } from "react-icons/tb";
import { config } from "../config";
import { useQuery } from "@tanstack/react-query";
import { AccountEditForm } from "../components/forms/AccountEditForm";
import { AccountDeleteForm } from "../components/forms/AccountDeleteForm";
import { AccountAddForm } from "../components/forms/AccountAddForm";
import { FiEdit3 } from "react-icons/fi";
import useDialog from "../utils/dialogStore";

const Accounts = () => {
  const { openDialog } = useDialog();

  const handleAccountEdit = (account: account) => {
    openDialog({
      title: "Edit Account Information",
      content: <AccountEditForm account={account} />,
    });
  };

  const handleAccountDelete = (accountId: number) => {
    openDialog({
      title: "Delete Account",
      content: <AccountDeleteForm accountId={accountId} />,
    });
  };

  const handleAccountAdd = () => {
    openDialog({
      title: "Create account",
      content: <AccountAddForm />,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["accInformation"],
    queryFn: () => fetch(config.baseApiUrl + "/hi").then((res) => res.json()),
  });

  return (
    <div>
      <h1 className="center my-4 text-2xl font-semibold">
        List of Employee Accounts
      </h1>
      <div>
        <button
          onClick={() => handleAccountAdd()}
          className="mb-4 self-start rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-800"
        >
          Create an account
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-center">AccountID</th>
              <th className="p-2 text-center">First Name</th>
              <th className="p-2 text-center">Last Name</th>
              <th className="p-2 text-center">Username</th>
              <th className="p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((user: account, index: number) => (
              <tr
                key={user.id}
                className="border-b border-gray-300 bg-gray-100"
              >
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 text-center">{user.firstName}</td>
                <td className="p-2 text-center">{user.lastName}</td>
                <td className="p-2 text-center">{user.username}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleAccountEdit(user)}
                    className="ml-4 mr-1 hover:scale-110"
                  >
                    <FiEdit3 size={24} />
                  </button>
                  <button
                    onClick={() => handleAccountDelete(user.id)}
                    className="ml-4 mr-1 hover:scale-110"
                  >
                    <TbTrash size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Accounts;
