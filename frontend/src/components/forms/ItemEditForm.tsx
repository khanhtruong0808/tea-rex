import { SubmitHandler, useForm } from "react-hook-form";
import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";
import { Spinner } from "../../utils/Spinner";

export const ItemEditForm = ({ item }: { item: MenuItem }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuItem>({
    defaultValues: {
      name: item.name,
      price: item.price,
      menuType: item.menuType,
    },
  });

  const mutation = useMutation({
    mutationFn: (newItem: MenuItem) =>
      fetch(config.baseApiUrl + `/menu-item/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(newItem),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSections"] });
      toast.success("Menu item edited");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Could not edit menu item");
    },
  });

  const onSubmit: SubmitHandler<MenuItem> = async (data) => {
    setLoading(true);
    await mutation.mutateAsync({ ...data });
    setLoading(false);
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Name
        </label>
        <div className="mt-2">
          <input
            {...register("name", { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Price
        </label>
        <div className="mt-2">
          <input
            type="number"
            step={0.01}
            {...register("price", { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.price && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
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
