import { SubmitHandler, useForm } from "react-hook-form";
import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";

export const SectionEditForm = ({ section }: { section: MenuSection }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<MenuSection>({
    defaultValues: {
      name: section.name,
      imageUrl: section.imageUrl,
      imageAltText: section.imageAltText,
    },
  });

  const mutation = useMutation({
    mutationFn: (newSection: MenuSection) =>
      fetch(config.baseApiUrl + `/menu-section/${section.id}`, {
        method: "PUT",
        body: JSON.stringify(newSection),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSections"] });
      toast.success("Menu section edited");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Could not edit menu section");
    },
  });

  const onSubmit: SubmitHandler<MenuSection> = async (data) => {
    setLoading(true);
    await mutation.mutateAsync({ ...data });
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
          {...register("name")}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-gray-900"
          htmlFor="imageUrl"
        >
          Image URL
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          {...register("imageUrl")}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1 text-gray-900"
          htmlFor="imageAltText"
        >
          Image Alt Text
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          {...register("imageAltText")}
        />
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