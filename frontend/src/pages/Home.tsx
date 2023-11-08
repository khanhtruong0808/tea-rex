import { useState, useEffect, useRef } from "react";
import Map from "../components/Map";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectFade, Autoplay } from "swiper";
import LogoutHandler from "../components/LogoutButton";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import adminModeStore from "../utils/adminModeStore";

const galleryItems = [
  { src: "food-items/chicken-ramen-burger.webp", alt: "chicken ramen burger" },
  { src: "food-items/menu-board.webp", alt: "menu-board" },
  { src: "food-items/outside.webp", alt: "outside" },
  {
    src: "food-items/popcorn-chicken-bento-rice.webp",
    alt: "popcorn chicken bento rice",
  },
  { src: "food-items/popcorn-chicken.webp", alt: "popcorn chicken" },
  { src: "food-items/spam-masubi.webp", alt: "spam masubi" },
  { src: "food-items/tofu.webp", alt: "tofu" },
  { src: "food-items/outside1.webp", alt: "outside" },
];
const Home: React.FC = () => {
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

  const containerRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let widget: any = null;
    if (window && containerRef.current) {
      widget = window.cloudinary.galleryWidget({
        container: containerRef.current,
        cloudName: "dwtzyvjko",
        aspectRatio: "40:10",
        mediaAssets: [{ tag: "top-items" }],
        carouselStyle: "indicators",
        carouselLocation: "bottom",
      });
      widget.render();
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, []);

  return (
    <div className="relative">
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
      {/* Gallery section */}
      <div className="group relative m-auto h-[580px] w-full max-w-[px] select-none px-4 py-16">
        <Swiper
          style={
            {
              "--swiper-navigation-color": "#000000",
              "--swiper-pagination-color": "#000000",
            } as React.CSSProperties
          }
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect={"fade"}
          modules={[Pagination, Navigation, EffectFade, Autoplay]}
          navigation={true}
          pagination={{ clickable: true }}
          // onSlideChange={() => console.log("slide change")}
          // onSwiper={(swiper) => console.log(swiper)}
          className="relative h-full w-full rounded-2xl object-cover object-center"
        >
          {galleryItems.map((item, index) => (
            <SwiperSlide key={index}>
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full cursor-pointer object-cover"
                onClick={handleImageClick}
              ></img>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* About Us & Map Section */}
      <div className="flex flex-col sm:container sm:mx-auto md:flex-row">
        <div className="mb-4 flex-1 md:mb-0">
          <h1 className="font-menu pb-4 text-center text-6xl font-extrabold">
            About Us
          </h1>
          <div className="justify-center border-t-2 border-black pt-2"></div>
          <h2 className="pt-3 text-center text-xl">
            Tea Rex is a mom and pop shop offering boba drinks and Asian cuisine
            in a trendy, cheerful atmosphere. We make everything with love using
            only the freshest ingredients. We offer a variety of Asian dishes,
            including authentic ramen, sushi, bento boxes, hot pots, and snacks.
            From our famous ramen burger to our popcorn chicken, our unique
            Asian-American flavors are sure to delight! Wash down your meal with
            our incredible selection of flavored teas, milk teas, and slushies,
            available in flavors like mango, taro, passionfruit, lychee, and
            many more. Join us for a casual dining experience or place your
            order to go for a filling meal or delicious drink on the go!
          </h2>
        </div>
        <div className="flex min-h-[300px] flex-1 justify-center p-0 sm:p-10">
          <Map />
        </div>
      </div>
      {/* Top Ten Items Section */}
      <section className="mt-10">
        <div>
          <div className="mx-auto w-9/12 max-w-xl">
            <h1 className="font-menu pb-4 text-center text-6xl font-extrabold">
              Top Ten Items
            </h1>
            <div className="justify-center border-t-2 border-black pt-2"></div>
          </div>
        </div>
        <div
          ref={containerRef}
          style={{ width: "1200px,", margin: "auto" }}
        ></div>
      </section>
      <div>{isAdmin && <LogoutHandler />}</div>
    </div>
  );
};

export default Home;
