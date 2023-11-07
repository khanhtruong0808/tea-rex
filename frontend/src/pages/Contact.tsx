import { AlertProvider } from "../components/AlertMessageContext";
import ContactSection from "../components/ContactSection"; //update contact info in ContactSection.tsx
import EmailForm from "../components/forms/EmailForm";
import LogoutHandler from "../components/LogoutButton"
import adminModeStore from "../utils/adminModeStore";

export default function Contact() {
  const [isAdmin] = adminModeStore((state) => [state.isAdmin]);
  return (
    <div>
      <ContactSection />
      <AlertProvider>
        <EmailForm />
      </AlertProvider>
      <div>
        {isAdmin && (
          <LogoutHandler />
        )}
      </div>
    </div>
    
  );
}
