import { FiEdit3 } from "react-icons/fi";
import { config } from "../config";
import axios from "axios";

interface MenuPhotosProps {
  sectionId: number;
}
let file: File;

export function MenuPhoto({ sectionId }: MenuPhotosProps) {
  async function updateImageUrlInDb(url: string) {
    console.log(sectionId);
    try {
      const res = await axios({
        method: "PUT",
        url: `${config.baseApiUrl}/menu-section/${sectionId}`,
        data: {
          imageUrl: url,
        },
      });
    } catch (err) {
      console.error(err);
    }
    window.location.reload(); // image is not updated on screen until page is reloaded
  }

  async function getSignature() {
    try {
      const res = await axios({
        method: "GET",
        url: `${config.baseApiUrl}/cloudinary-signature`,
      });
      uploadMedia(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  async function uploadMedia(data: any) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", data.apiKey);
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);
      formData.append("folder", "TeaRex");

      const res = await axios({
        method: "POST",
        url: `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
        data: formData,
      });
      updateImageUrlInDb(res.data.url);
    } catch (err) {
      console.error(err);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      if (files.length > 1) {
        console.error("Please select only one file at a time.");
      } else {
        file = files[0];
        getSignature();
      }
    }
  }
  return (
    <>
      <label className="cursor-pointer rounded-full p-0.5 hover:scale-110 w-[28px] h-[28px]">
        <FiEdit3 size={28} />
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </label>
    </>
  );
}
