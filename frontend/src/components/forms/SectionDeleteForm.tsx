import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";

export const SectionDeleteForm = ({ sectionId }: { sectionId: number }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sectionId: number) =>
      fetch(config.baseApiUrl + `/menu-section/${sectionId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSections"] });
      toast.success("Menu section deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Could not delete menu section");
    },
  });

  const handleDelete = async () => {
    setLoading(true);
    await mutation.mutateAsync(sectionId);
    setLoading(false);
    closeDialog();
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-md text-gray-700">
        Are you sure you want to delete this section?<br></br>
        This action cannot be undone.
      </h2>
      <div className="justify-between flex gap-4 items-center">
        <button
          className="text-sm text-gray-800 bg-gray-100 px-5 py-2.5 rounded-lg hover:bg-gray-200 ring-1 ring-gray-100"
          onClick={closeDialog}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className={`${
            loading && "opacity-50 cursor-not-allowed"
          } text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 self-start w-24`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mx-auto"
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
                stroke-width="4"
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
