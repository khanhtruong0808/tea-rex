import styled from "styled-components";
import { MdEmail, MdLocalPhone, MdPlace } from "react-icons/md";
import ContactInfoItem from "./ContactInfo";
import SectionTitle from "./SectionTitle";

// const ContactSectionStyle = styled.div`
//   padding: 1rem 0;
//   .contactSection__wrapper {
//     display: flex;
//     gap: 5rem;
//     margin-top: 3rem;
//     justify-content: space-between;
//     position: relative;
//   }
//   .contactSection__wrapper::after {
//     position: absolute;
//     content: "";
//     width: 2px;
//     height: 50%;
//     background-color: var(--gray-1);
//     left: 50%;
//     top: 30%;
//     transform: translate(-50%, -50%);
//   }
//   .left {
//     width: 100%;
//     max-width: 500px;
//   }
//   .right {
//     max-width: 500px;
//     width: 100%;
//     border-radius: 12px;
//     /* padding-left: 3rem; */
//   }
//   @media only screen and (max-width: 768px) {
//     .contactSection__wrapper {
//       flex-direction: column;
//     }
//     .contactSection__wrapper::after {
//       display: none;
//     }
//     .left,
//     .right {
//       max-width: 100%;
//     }
//     .right {
//       padding: 4rem 2rem 2rem 2rem;
//     }
//   }
// `;

export default function ContactSection() {
  return (
    //Update info here

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
