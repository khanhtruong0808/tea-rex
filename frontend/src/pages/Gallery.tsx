import { useState, useEffect } from "react";
import LogoutHandler from "../components/LogoutButton"
import adminModeStore from "../utils/adminModeStore";

const foodPics = [
  { src: "galleryPhotos/fd1.webp", alt: "" },
  { src: "galleryPhotos/fd2.webp", alt: "" },
  { src: "galleryPhotos/fd4.webp", alt: "" },
  { src: "galleryPhotos/fd3.webp", alt: "" },
  { src: "galleryPhotos/fd5.webp", alt: "" },
  { src: "galleryPhotos/fd6.webp", alt: "" },
];
const restaurantPics = [
  { src: "galleryPhotos/inside1.webp", alt: "" },
  { src: "galleryPhotos/inside2.webp", alt: "" },
  { src: "galleryPhotos/inside3.webp", alt: "" },
  { src: "galleryPhotos/inside4.webp", alt: "" },
  { src: "galleryPhotos/inside5.webp", alt: "" },
  { src: "galleryPhotos/inside6.webp", alt: "" },
];

const Gallery = () => {
  const [isAdmin] = adminModeStore((state) => [state.isAdmin]);

  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(
    null,
  );

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setFullScreenImageUrl(event.currentTarget.src);
  };

  const closeFullScreen = () => {
    if (fullScreenImageUrl) {
      setFullScreenImageUrl(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div className="mx-auto w-9/12 max-w-xl">
        <h1 className="font-menu py-4 text-center text-6xl font-extrabold">
          Our Gallery
        </h1>
      </div>
      {fullScreenImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={closeFullScreen}
        >
          <img
            src={fullScreenImageUrl}
            alt="Full Screen"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
      <div className="font-menu mx-auto w-9/12 border-t-2 border-black text-3xl">
        <div className="container mx-auto my-10">
          <div>
            <h2 className="pb-3">
              <u>Food & Drinks</u>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {foodPics.map((item, index) => (
              <div className="aspect-square overflow-hidden" key={index}>
                <img
                  src={item.src}
                  alt={item.alt}
                  onClick={handleImageClick}
                  className="h-full w-full object-cover hover:cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div>
            <h2 className="pb-3 pt-6 ">
              <u>Restaurant</u>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {restaurantPics.map((item, index) => (
              <div className="aspect-square overflow-hidden" key={index}>
                <img
                  className="h-full w-full hover:cursor-pointer"
                  src={item.src}
                  alt={item.alt}
                  onClick={handleImageClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {isAdmin && (
          <LogoutHandler />
        )}
      </div>
    </div>
  );
};
export default Gallery;
