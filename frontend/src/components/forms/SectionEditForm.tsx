import { SubmitHandler, useForm } from "react-hook-form";
import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";
import { Spinner } from "../../utils/Spinner";

export const SectionEditForm = ({ section }: { section: MenuSection }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<MenuSection>({
    defaultValues: {
      name: section.name,
      menuType: section.menuType,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div>
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...register("name")}
        />
      </div>
      <div>
        <label
          htmlFor="menuType"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Menu Type
        </label>
        <select
          id="menuType"
          {...register("menuType", { required: true })}
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="beverage">Beverage</option>
          <option value="food">Food</option>
        </select>
      </div>
      <div>
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor="imageUrl"
        >
          Image URL
        </label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...register("imageUrl")}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor="imageAltText"
        >
          Image Alt Text
        </label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...register("imageAltText")}
        />
      </div>
      <div></div>
      <button
        type="submit"
        className={`${
          loading && "cursor-not-allowed opacity-50"
        } mb-2 mr-2 w-24 self-start rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-800`}
      >
        {loading ? <Spinner /> : "Submit"}
      </button>
    </form>
  );
};
