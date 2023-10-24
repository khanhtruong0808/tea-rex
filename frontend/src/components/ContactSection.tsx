import styled from "styled-components";
import { MdEmail, MdLocalPhone, MdPlace } from "react-icons/md";
import ContactInfoItem from "./ContactInfo";
import SectionTitle from "./SectionTitle";

export default function ContactSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container">
        <SectionTitle
          heading="Contact us here"
          subheading="Give us some feedback!"
        />
        <div className="flex space-x-6">
          <ContactInfoItem
            icon={<MdLocalPhone style={{ fontSize: "50px" }} />}
            text="+916-XXX-XXXX"
          />
          <ContactInfoItem
            icon={<MdEmail style={{ fontSize: "50px" }} />}
            text="Tearexelkgrove@yahoo.com"
          />
          <ContactInfoItem
            icon={<MdPlace style={{ fontSize: "50px" }} />}
            text="City, Address, State"
          />
        </div>
      </div>
    </div>
  );
}
