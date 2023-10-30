import { FormEvent, useState, useEffect } from "react";
import { config } from "../../config";
import useAlert from "../AlertMessageContext";

function isNotValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return !regex.test(email);
}

type ValidationErrorType = "email" | "first_name" | "last_name" | "message";

export default function EmailForm() {
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validations: { condition: boolean; type: ValidationErrorType }[] = [
    {
      condition: isNotValidEmail(userEmail),
      type: "email",
    },
    {
      condition: userFirstName.length === 0,
      type: "first_name",
    },
    {
      condition: userLastName.length === 0,
      type: "last_name",
    },
    { condition: userMessage.length === 0, type: "message" },
  ];

  const errorSetters: Record<
    ValidationErrorType,
    React.Dispatch<React.SetStateAction<boolean>>
  > = {
    email: setEmailError,
    first_name: setFirstNameError,
    last_name: setLastNameError,
    message: setMessageError,
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSubmitted) {
      timeoutId = setTimeout(() => {
        setIsSubmitted(false);
      }, 2500);
    }

    return () => clearTimeout(timeoutId);
  }, [isSubmitted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formInvalid = false;

    for (const validation of validations) {
      if (validation.condition) {
        formInvalid = true;
        errorSetters[validation.type](true);
      }
    }

    if (formInvalid) {
      console.error("Form is invalid!");
      return;
    }

    try {
      const response = await fetch(config.baseApiUrl + "/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: userEmail,
          to: "cristopher2@ethereal.email", // testing email, change to tea-rex email before final deployment
          subject: "Customer query",
          text: userMessage,
        }),
      });

      const emailResponse = await response.json();

      if (emailResponse.success) {
        console.log("Email sent successfully!");
        setIsSubmitted(true);
      } else {
        console.error("Failed to send email", emailResponse.message);
      }
    } catch (error: any) {
      console.error("Problem with sending email", error.message);
    }

    setUserFirstName("");
    setUserLastName("");
    setUserEmail("");
    setUserMessage("");
  };
  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto p-6">
      <div className="flex flex-col items-center justify-center mb-5 w-full mx-auto">
        <fieldset className="border border-gray-300 p-4 m-12 rounded-md w-full">
          {isSubmitted ? (
            <p className="text-xl"> Your query has been submitted! </p>
          ) : (
            <>
              <div className="mb-4 flex mx-auto">
                <div className="w-1/2 pr-1 flex flex-col">
                  <input
                    type="text"
                    placeholder="First name"
                    className={`${
                      firstNameError
                        ? "border-2 border-red-500"
                        : "border border-gray-200"
                    } font-navbar rounded mr-1 w-full`}
                    onChange={(e) => {
                      setUserFirstName(e.target.value);
                      if (e.target.value.length > 0) {
                        setFirstNameError(false);
                      }
                    }}
                  />
                  {firstNameError && (
                    <p className="text-xs text-red-500">
                      Please enter a first name!
                    </p>
                  )}
                </div>
                <div className="w-1/2 pr-1 flex flex-col">
                  <input
                    type="text"
                    placeholder="Last name"
                    className={`${
                      lastNameError
                        ? "border-2 border-red-500"
                        : "border border-gray-200"
                    } font-navbar rounded w-full`}
                    onChange={(e) => {
                      setUserLastName(e.target.value);
                      if (e.target.value.length > 0) {
                        setLastNameError(false);
                      }
                    }}
                  />
                  {lastNameError && (
                    <p className="text-xs text-red-500">
                      Please enter a last name!
                    </p>
                  )}
                </div>
              </div>
              <div className="pr-1 mb-4 flex flex-col">
                <input
                  type="text"
                  placeholder="Enter your email address"
                  className={`${
                    emailError
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                  } font-navbar w-full flex rounded`}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    if (e.target.value.length > 0) {
                      setEmailError(false);
                    }
                  }}
                />
                {emailError && (
                  <p className="text-xs text-red-500">
                    Please enter an email address!
                  </p>
                )}
              </div>
              <div className="pr-1 mb-2 flex flex-col">
                <textarea
                  rows={10}
                  placeholder="Message"
                  className={`${
                    messageError
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                  } font-navbar w-full flex rounded`}
                  onChange={(e) => {
                    setUserMessage(e.target.value);
                    if (e.target.value.length > 0) {
                      setMessageError(false);
                    }
                  }}
                />
                {messageError && (
                  <p className="text-xs text-red-500">
                    Message cannot be blank!
                  </p>
                )}
              </div>
              <div className="flex mt-4 mx-auto">
                <button className="bg-lime-700 text-white font-semibold py-2 px-4 rounded hover:scale-110 transition lg:block">
                  Submit
                </button>
              </div>
            </>
          )}
        </fieldset>
      </div>
    </form>
  );
}
