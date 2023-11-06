import { FiEdit3 } from "react-icons/fi";
import { config } from "../config";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "../utils/Spinner";

interface MenuPhotosProps {
  sectionId: number;
}

interface MediaData {
  apiKey: string;
  cloudName: string;
  signature: string;
  timestamp: string;
}

let file: File;

export function MenuPhoto({ sectionId }: MenuPhotosProps) {
  const [loading, setLoading] = useState(false);
  async function updateImageUrlInDb(url: string) {
    console.log(sectionId);
    try {
      await axios({
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
  async function uploadMedia(data: MediaData) {
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
    setLoading(true);
    const files = event.target.files;
    if (files) {
      if (files.length > 1) {
        console.error("Please select only one file at a time.");
      } else {
        file = files[0];
        getSignature();
      }
    }
    setLoading(false);
  }
  return (
    <>
      <label className="h-[28px] w-[28px] cursor-pointer rounded-full p-0.5 hover:scale-110">
        {loading ? <Spinner className="text-black" /> : <FiEdit3 size={28} />}
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </>
  );
}
