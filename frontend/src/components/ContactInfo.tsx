import { MdPlace } from "react-icons/md";
import PText from "./Ptext";

export default function ContactInfo({ icon = <MdPlace />, text = "" }) {
  return (
    <div className="flex items-center gap-6 rounded-lg px-2 py-8 xl:gap-8">
      <div className="flex items-center justify-center rounded-full bg-green-600 p-5">
        {icon}
      </div>
      <div className="flex flex-col whitespace-nowrap">
        <PText>{text}</PText>
      </div>
    </div>
  );
}
