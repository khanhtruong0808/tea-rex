import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
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
    <div className="flex flex-col gap-2">
      <h2 className="text-md">
        Are you sure you want to delete this section?{" "}
      </h2>
      <b>This action cannot be undone.</b>
      <button
        onClick={handleDelete}
        className={`${
          loading && "opacity-50 cursor-not-allowed"
        } text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 self-start`}
      >
        {loading ? (
          <span className="flex items-center gap-4">
            <AiOutlineLoading className="animate-spin" size={20} />
            Deleting...
          </span>
        ) : (
          "Delete"
        )}
      </button>
    </div>
  );
};
