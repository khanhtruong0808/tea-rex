import { MdPlace } from "react-icons/md";
import PText from "./Ptext";

interface ContactInfoProps {
  icon?: JSX.Element;
  text?: string;
}

export default function ContactInfo({
  icon = <MdPlace />,
  text = "",
}: ContactInfoProps) {
  return (
    <div className="flex items-center gap-6 rounded-lg px-2 py-8 xl:gap-8">
      <div className="flex items-center justify-center rounded-full bg-lime-700 p-5">
        {icon}
      </div>
      <div className="flex flex-col ">
        <PText>{text}</PText>
      </div>
    </div>
  );
}
