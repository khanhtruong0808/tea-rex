import { AlertProvider } from "../components/AlertMessageContext";
import ContactSection from "../components/ContactSection"; //update contact info in ContactSection.tsx
import EmailForm from "../components/forms/EmailForm";
export default function Contact() {
  return (
    <div>
      <ContactSection />
      <AlertProvider>
        <EmailForm />
      </AlertProvider>
    </div>
  );
}
