import { useState, useEffect } from "react";
import Map from "../components/Map";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectFade, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const topTenItems = [
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636235/TeaRex/TopItems/1_qbs1pp.jpg", alt: "item1" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636243/TeaRex/TopItems/2_pq7juc.jpg", alt: "item2" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636246/TeaRex/TopItems/3_vtdaht.jpg", alt: "item3" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636250/TeaRex/TopItems/4_k3rtvb.jpg", alt: "item4" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636253/TeaRex/TopItems/5_pd1uhu.jpg", alt: "item5" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636257/TeaRex/TopItems/6_smi0wq.jpg", alt: "item6" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636260/TeaRex/TopItems/7_brrd1p.jpg", alt: "item7" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636264/TeaRex/TopItems/8_ykzm77.jpg", alt: "item8" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636267/TeaRex/TopItems/9_y5jiyc.jpg", alt: "item9" },
  { src: "https://res.cloudinary.com/dwtzyvjko/image/upload/v1698636272/TeaRex/TopItems/10_zsdorh.jpg", alt: "item10" },
];

const galleryItems = [
  { src: "food-items/chicken-ramen-burger.jpg", alt: "chicken ramen burger" },
  { src: "food-items/menu-board.jpg", alt: "menu-board" },
  { src: "food-items/outside.jpg", alt: "outside" },
  {
    src: "food-items/popcorn-chicken-bento-rice.jpg",
    alt: "popcorn chicken bento rice",
  },
  { src: "food-items/popcorn-chicken.jpg", alt: "popcorn chicken" },
  { src: "food-items/spam-masubi.jpg", alt: "spam masubi" },
  { src: "food-items/tofu.jpg", alt: "tofu" },
  { src: "food-items/outside1.jpg", alt: "outside" },
];

const Home: React.FC = () => {
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(
    null
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
    <div className="relative">
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
      {/* Gallery section */}
      <div className="max-w-[px] h-[580px] select-none w-full m-auto py-16 px-4 relative group">
        <Swiper
          style={{
            /*@ts-ignore*/
            "--swiper-navigation-color": "#000000",
            "--swiper-pagination-color": "#000000",
          }}
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
          className="w-full h-full rounded-2xl object-center object-cover relative"
        >
          {galleryItems.map((item, index) => (
            <SwiperSlide key={index}>
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full cursor-pointer object-cover"
                onClick={handleImageClick}
              ></img>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* About Us & Google Map Section */}
      <div className="flex flex-col md:flex-row sm:container sm:mx-auto">
        <div className="flex-1 mb-4 md:mb-0">
          <h1 className="font-extrabold text-center text-6xl pb-4 font-menu">
            About Us
          </h1>
          <div className="pt-2 border-t-2 border-black justify-center"></div>
          <h2 className="text-center text-xl pt-3">
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
        <div className="flex-1 flex p-0 sm:p-10 justify-center min-h-[300px]">
          <Map />
        </div>
      </div>
      {/* Top Ten Items Section */}
      <section className="mt-10">
        <div>
          <div className="w-9/12 max-w-xl mx-auto">
            <h1 className="font-extrabold text-center text-6xl pb-4 font-menu">
              Top Ten Items
            </h1>
            <div className="pt-2 border-t-2 border-black justify-center"></div>
          </div>
        </div>
        <div className="max-w-[px] h-[580px] select-none w-full m-auto py-16 px-4 relative group">
          <Swiper
            style={{
              /*@ts-ignore*/
              "--swiper-navigation-color": "#000000",
              "--swiper-pagination-color": "#000000",
            }}
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 80 },
              768: { slidesPerView: 2, spaceBetween: 150 },
              1024: { slidesPerView: 3, spaceBetween: 50 },
            }}
            loop={true}
            modules={[Pagination, Navigation]}
            navigation={true}
            pagination={{ clickable: true }}
            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
            className="w-full h-full rounded-2xl object-center object-cover relative"
          >
            {topTenItems.map((item, index) => (
              <SwiperSlide key={index}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full cursor-pointer object-scale-down"
                  onClick={handleImageClick}
                ></img>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
