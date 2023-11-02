import { MdPlace } from "react-icons/md";
import PText from "./Ptext";

export default function ContactInfo({ icon = <MdPlace />, text = "" }) {
  return (
    <div className="mb-8 flex items-center gap-8 rounded-lg p-8">
      <div className="flex items-center justify-center rounded-full bg-green-600 p-5">
        {icon}
      </div>
      <div className="flex flex-col">
        <PText>{text}</PText>
      </div>
    </div>
  );
}
