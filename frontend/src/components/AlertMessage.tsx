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
    <div className="fixed inset-0 flex items-center justify-center">
      <Alert severity={severityColor}>{message}</Alert>
    </div>
  );
};

export default AlertMessage;
