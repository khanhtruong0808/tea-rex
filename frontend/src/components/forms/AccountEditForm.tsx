import { SubmitHandler, useForm } from "react-hook-form";
import { config } from "../../config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDialog from "../../utils/dialogStore";


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
        password: account.password,
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
    }

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
          htmlFor="price"
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
          htmlFor="menuType"
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
          htmlFor="menuType"
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
      <div></div>
      <button
        type="submit"
        className={`${
          loading && "opacity-50 cursor-not-allowed"
        } text-white bg-lime-700 hover:bg-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 self-start w-24`}
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
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}