import { SubmitHandler, useForm } from "react-hook-form";
import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";

export const ItemAddForm = ({ sectionId }: { sectionId: number }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuItem>();

  const mutation = useMutation({
    mutationFn: (newItem: MenuItem) =>
      fetch(config.baseApiUrl + "/menu-item", {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSections"] });
      toast.success("Menu item added");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Could not add menu item");
    },
  });

  const onSubmit: SubmitHandler<MenuItem> = async (data) => {
    setLoading(true);
    await mutation.mutateAsync({ ...data, menuSectionId: sectionId });
    setLoading(false);
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <label
          className="block text-sm font-medium mb-1 text-gray-900"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-gray-900"
          htmlFor="price"
        >
          Price
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          step={0.01}
          {...register("price", { required: true })}
        />
        {errors.price && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>
      <button
        type="submit"
        className={`${
          loading && "opacity-50 cursor-not-allowed"
        } text-white bg-lime-700 hover:bg-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 self-start`}
      >
        {loading ? (
          <span className="flex items-center gap-4">
            <AiOutlineLoading className="animate-spin" size={20} />
            Submitting...
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};