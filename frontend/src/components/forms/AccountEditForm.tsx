import { SubmitHandler, useForm } from "react-hook-form";
import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";
import { Spinner } from "../../utils/Spinner";

export const AccountEditForm = ({ account }: { account: account }) => {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = useDialog();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<account>({
    defaultValues: {
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
    },
  });

  const mutation = useMutation({
    mutationFn: (newAccount: account) =>
      fetch(config.baseApiUrl + `/accounts/${account.id}`, {
        method: "PUT",
        body: JSON.stringify(newAccount),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accInformation"] });
      toast.success("Account updated");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Could not edit account information");
    },
  });
  
  const onSubmit: SubmitHandler<account> = async (data) => {
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
          Username
        </label>
        <div className="mt-2">
          <input
            {...register("username", { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.username && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Password
        </label>
        <div className="mt-2">
          <input
            {...register("password", { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.password && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          First Name
        </label>
        <div className="mt-2">
          <input
            {...register("firstName", { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.firstName && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Last Name
        </label>
        <div className="mt-2">
          <input
            {...register("lastName", { required: true })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.lastName && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="isAdmin"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Admin Access?
        </label>
        <select
          id="isAdmin"
          {...register("isAdmin", { required: true })}
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="true">True</option>
          <option value="false">False</option>
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
