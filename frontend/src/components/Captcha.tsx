import { Turnstile } from "@marsidev/react-turnstile";
import { config } from "../config";
import React from "react";

interface CaptchaProps {
  onSuccess: (token: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onSuccess }) => {
  const ref = React.useRef<any>(null);

  function handleSuccess(token: string) {
    onSuccess(token);
    ref.current?.remove();
  }

  function handleError() {
    onSuccess("error");
  }

  return (
    <>
      <Turnstile
        siteKey={config.turnstileSiteKey}
        onSuccess={handleSuccess}
        options={{
          theme: "light",
          appearance: "execute",
        }}
        ref={ref}
        scriptOptions={{
          onError: handleError,
        }}
      />
    </>
  );
};
export default Captcha;
