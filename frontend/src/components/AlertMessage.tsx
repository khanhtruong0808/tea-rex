import React from "react";
import Alert from "@mui/material/Alert";
type AlertColor = "error" | "warning" | "info" | "success";

interface AlertMessageProps {
  message: string;
  severity: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  severity: severityProp,
}) => {
  const convertToAlertColor = (severity: string): AlertColor | undefined => {
    const validColors: AlertColor[] = ["error", "warning", "info", "success"];
    if (validColors.includes(severity as AlertColor)) {
      return severity as AlertColor;
    }
    console.warn("Invalid severity color:", severity);
    return undefined;
  };

  const severityColor: AlertColor | undefined =
    convertToAlertColor(severityProp);

  return (
    <div className="animate-fade-left fixed right-0 top-0 z-10 mr-8">
      <Alert severity={severityColor} z-index={50}>
        {message}
      </Alert>
    </div>
  );
};

export default AlertMessage;
