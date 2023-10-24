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
  };
  return (
    <form onSubmit={handleSubmit} className="w-full m-8">
      <div className="flex flex-col items-center justify-center mb-5 w-3/4 mx-auto">
        <fieldset className="border border-gray-300 p-4 m-12 rounded-md w-full">
          {isSubmitted ? (
            <p className="text-xl"> You query has been submitted! </p>
          ) : (
            <>
              <div className="mb-4 w-full flex">
                <input
                  type="text"
                  placeholder="First name"
                  className={`${
                    firstNameError
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                  } font-navbar flex-grow rounded mr-1`}
                  onChange={(e) => {
                    setUserFirstName(e.target.value);
                    if (e.target.value.length > 0) {
                      setFirstNameError(false);
                    }
                  }}
                ></input>
                <input
                  type="text"
                  placeholder="Last name"
                  className={`${
                    lastNameError
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                  } font-navbar flex-grow rounded`}
                  onChange={(e) => {
                    setUserLastName(e.target.value);
                    if (e.target.value.length > 0) {
                      setLastNameError(false);
                    }
                  }}
                ></input>
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                className={`${
                  emailError
                    ? "border-2 border-red-500"
                    : "border border-gray-200"
                } font-navbar  mb-4 w-full flex rounded`}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (e.target.value.length > 0) {
                    setEmailError(false);
                  }
                }}
              />
              <textarea
                rows={10}
                placeholder="Message"
                className={`${
                  messageError
                    ? "border-2 border-red-500"
                    : "border border-gray-200"
                } font-navbar mb-2 w-full flex rounded`}
                onChange={(e) => {
                  setUserMessage(e.target.value);
                  if (e.target.value.length > 0) {
                    setMessageError(false);
                  }
                }}
              />
              <div className="flex mt-4 space-x-2">
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
