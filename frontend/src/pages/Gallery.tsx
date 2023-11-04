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
      <div className="mx-auto w-9/12 border-t-2 border-black">
        <div className="container mx-auto my-10">
          <div>
            <h2 className="pb-3 text-3xl font-bold">
              <u>Food & Drinks</u>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {foodPics.map((item, index) => (
              <div
                className="w-82 pb-full flex h-80 items-center overflow-hidden rounded-sm"
                key={index}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  onClick={handleImageClick}
                  className="hover:cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div>
            <h2 className="pb-3 pt-6 text-3xl font-bold">
              <u>Restaurant</u>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {restaurantPics.map((item, index) => (
              <div
                className="w-82 pb-full flex h-80 items-center overflow-hidden rounded-sm bg-gray-300"
                key={index}
              >
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
    </div>
  );
};
export default Gallery;
