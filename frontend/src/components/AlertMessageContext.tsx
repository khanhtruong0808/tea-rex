import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AlertMessage from "./AlertMessage";

interface AlertContextProps {
  showAlert: (message: string, severity: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [severity, setSeverity] = useState("");

  function showAlert(message: string, severity: string) {
    setAlertMessage(message);
    setIsShowing(true);
    setSeverity(severity);
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isShowing) {
      timeoutId = setTimeout(() => {
        setIsShowing(false);
        setAlertMessage(null);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [isShowing]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {isShowing && alertMessage && (
        <AlertMessage message={alertMessage} severity={severity} />
      )}
    </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};

export default useAlert;
