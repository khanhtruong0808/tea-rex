import { FormEvent, useState, useEffect, useCallback } from "react";
import { config } from "../../config";
import Captcha from "../Captcha";
import { Spinner } from "../../utils/Spinner";

function isNotValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return !regex.test(email);
}

type ValidationErrorType = "email" | "first_name" | "last_name" | "message";

export default function EmailForm() {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNotABot, setIsNotABot] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

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
    setLoading(true);

    try {
      const response = await fetch(config.baseApiUrl + "/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: userEmail,
          to: "daphney.koss7@ethereal.email", // testing email, change to tea-rex email before final deployment
          subject: "Customer query",
          text: userMessage,
        }),
      });

      const emailResponse = await response.json();

      if (emailResponse.success) {
        console.log("Email sent successfully!");
        setUserFirstName("");
        setUserLastName("");
        setUserEmail("");
        setUserMessage("");
        setIsSubmitted(true);
      } else {
        console.error("Failed to send email", emailResponse.message);
      }
    } catch (error: any) {
      console.error("Problem with sending email", error.message);
    }

    setLoading(false);
  };

  const handleTurnstileSuccess = useCallback((token: string) => {
    if (token == "error") {
      setCaptchaError(true);
    } else {
      setIsNotABot(true);
    }
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <Captcha onSuccess={handleTurnstileSuccess} />
      </div>
      {captchaError && (
        <div
          className="flex justify-center font-semibold"
          style={{ fontSize: "36px" }}
        >
          Captcha error!
        </div>
      )}
      {isNotABot && !captchaError && (
        <form onSubmit={handleSubmit} className="mx-auto w-full p-6">
          <div className="mx-auto mb-5 flex w-full flex-col items-center justify-center">
            <fieldset className="w-full rounded-md border border-gray-300 p-4">
              {isSubmitted ? (
                <p className="text-xl"> Your query has been submitted! </p>
              ) : (
                <>
                  <div className="mx-auto mb-4 flex">
                    <div className="flex w-1/2 flex-col pr-1">
                      <input
                        type="text"
                        placeholder="First name"
                        className={`${
                          firstNameError ? "border-red-500" : "border-gray-200"
                        } font-navbar mr-1 w-full rounded border`}
                        value={userFirstName}
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
                    <div className="flex w-1/2 flex-col pr-1">
                      <input
                        type="text"
                        placeholder="Last name"
                        className={`${
                          lastNameError ? "border-red-500" : "border-gray-200"
                        } font-navbar w-full rounded border`}
                        value={userLastName}
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
                  <div className="mb-4 flex flex-col pr-1">
                    <input
                      type="text"
                      placeholder="Enter your email address"
                      className={`${
                        emailError ? "border-red-500" : "border-gray-200"
                      } font-navbar flex w-full rounded border`}
                      value={userEmail}
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
                  <div className="mb-2 flex flex-col pr-1">
                    <textarea
                      rows={10}
                      placeholder="Message"
                      className={`${
                        messageError ? "border-red-500" : "border-gray-200"
                      } font-navbar flex w-full rounded border`}
                      value={userMessage}
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
                  <div className="mx-auto mt-4 flex">
                    <button className="rounded bg-lime-700 px-4 py-2 font-semibold text-white hover:bg-lime-800 lg:block">
                      {loading ? <Spinner /> : "Submit"}
                    </button>
                  </div>
                </>
              )}
            </fieldset>
          </div>
        </form>
      )}
    </>
  );
}
