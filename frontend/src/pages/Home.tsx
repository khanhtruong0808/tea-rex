import {useState, useEffect} from "react";
import GoogleMap from "../components/GoogleMap";

const topTenItems = [
  { src: "top-ten-items/1.jpg", alt: "item1" },
  { src: "top-ten-items/2.jpg", alt: "item2" },
  { src: "top-ten-items/3.jpg", alt: "item3" },
  { src: "top-ten-items/4.jpg", alt: "item4" },
  { src: "top-ten-items/5.jpg", alt: "item5" },
  { src: "top-ten-items/6.jpg", alt: "item6" },
  { src: "top-ten-items/7.jpg", alt: "item7" },
  { src: "top-ten-items/8.jpg", alt: "item8" },
  { src: "top-ten-items/9.jpg", alt: "item9" },
  { src: "top-ten-items/10.jpg", alt: "item10" },
];

const galleryItems = [
  { src: "food-items/chicken-ramen-burger.jpg", alt: "chicken ramen burger" },
  { src: "food-items/menu-board.jpg", alt: "menu-board"},
  { src: "food-items/outside.jpg", alt: "outside"},
  { src: "food-items/popcorn-chicken-bento-rice.jpg", alt: "popcorn chicken bento rice"},
  { src: "food-items/popcorn-chicken.jpg", alt: "popcorn chicken"},
  { src: "food-items/spam-masubi.jpg", alt: "spam masubi"},
  { src: "food-items/tofu.jpg", alt: "tofu"},
  { src: "food-items/outside1.jpg", alt: "outside"}
]

const Home: React.FC = () => {

  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);

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
      <div className="relative">
      {fullScreenImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={closeFullScreen}>
          <img src={fullScreenImageUrl} alt="Full Screen" className="max-w-full max-h-full object-contain" />
        </div>
      )}
      {/* Gallery section */}
      <section className="mt-10">
      <div className="flex flex-wrap">
        {galleryItems.map((item, index) => (
          <figure key = {index} className="text-center">
            <img
              src={item.src}
              alt = {item.alt}
              className="w-64 h-64 object-cover cursor-pointer"
              onClick={handleImageClick}
            />
          </figure>
        ))}
      </div>
      </section>
      {/* Top Ten Items Section */}
      <section className="mt-10">
      <h2 className="text-3xl font-bold mb-5">Top Ten Items</h2>
      <div className="flex flex-wrap">
        {topTenItems.map((item, index) => (
          <figure key = {index} className="text-center">
            <img
              src={item.src}
              alt = {item.alt}
              className="w-64 h-64 object-cover cursor-pointer"
              onClick={handleImageClick}
            />
            
          </figure>
        ))}
      </div>
      </section>
      {/* Google Map Section */}
      <section className="mt-10">
        <GoogleMap />
      </section>
    </div>
    );
  };

export default Home;