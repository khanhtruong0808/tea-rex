import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";

export const AccountDeleteForm = ({ accountId }: { accountId: number }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (accountId: number) =>
      fetch(config.baseApiUrl + `/accounts/${accountId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accInformation"] });
      toast.success("Account deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Could not delete this account");
    },
  });

  const handleDelete = async () => {
    setLoading(true);
    await mutation.mutateAsync(accountId);
    setLoading(false);
    closeDialog();
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-md text-gray-700">
        Are you sure you want to delete this account? <br></br>This action
        cannot be undone.
      </h2>
      <div className="flex items-center justify-between gap-4">
        <button
          className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm text-gray-800 ring-1 ring-gray-100 hover:bg-gray-200"
          onClick={closeDialog}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className={`${
            loading && "cursor-not-allowed opacity-50"
          } mb-2 mr-2 w-24 self-start rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700`}
        >
          {loading ? (
            <svg
              className="mx-auto h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};
