import { useState, useEffect } from "react";

const foodPics = [
  { src: "galleryPhotos/fd1.jpeg", alt: "" },
  { src: "galleryPhotos/fd2.jpeg", alt: "" },
  { src: "galleryPhotos/fd4.jpeg", alt: "" },
  { src: "galleryPhotos/fd3.jpeg", alt: "" },
  { src: "galleryPhotos/fd5.jpeg", alt: "" },
  { src: "galleryPhotos/fd6.jpeg", alt: "" },
];
const restaurantPics = [
  { src: "galleryPhotos/inside1.jpeg", alt: "" },
  { src: "galleryPhotos/inside2.jpeg", alt: "" },
  { src: "galleryPhotos/inside3.jpeg", alt: "" },
  { src: "galleryPhotos/inside4.jpeg", alt: "" },
  { src: "galleryPhotos/inside5.jpeg", alt: "" },
  { src: "galleryPhotos/inside6.jpeg", alt: "" },
];

const Gallery = () => {
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(
    null,
  );

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setFullScreenImageUrl(event.currentTarget.src); // copies the clicked image's url to be stored this variable
  };

  const closeFullScreen = () => {
    setFullScreenImageUrl(null); // removes the clicked image's url by setting it to null
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (fullScreenImageUrl && event.key === "Escape") {
      closeFullScreen();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullScreenImageUrl]);
  return (
    <div>
      <div className="w-9/12 max-w-xl mx-auto">
        <h1 className="font-extrabold text-center text-6xl py-4 font-menu">
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
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="w-9/12 border-t-2 border-black mx-auto">
        <div className="container mx-auto my-10">
          <div>
            <h2 className="pb-3 text-3xl font-bold">
              <u>Food & Drinks</u>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {foodPics.map((item, index) => (
              <div
                className="rounded-sm overflow-hidden w-82 h-80 pb-full flex items-center"
                key={index}
              >
                <img
                  // className=""
                  src={item.src}
                  alt={item.alt}
                  onClick={handleImageClick}
                />
              </div>
            ))}
          </div>
          <div>
            <h2 className="pt-6 pb-3 text-3xl font-bold">
              <u>Restaurant</u>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {restaurantPics.map((item, index) => (
              <div
                className="bg-gray-300 rounded-sm overflow-hidden w-82 h-80 pb-full flex items-center"
                key={index}
              >
                <img
                  className="w-full h-full"
                  src={item.src}
                  alt={item.alt}
                  onClick={handleImageClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // make folder for pictures in public folder
};
export default Gallery;
