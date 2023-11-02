import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";
import { Spinner } from "../../utils/Spinner";

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
          {loading ? <Spinner /> : "Delete"}
        </button>
      </div>
    </div>
  );
};
