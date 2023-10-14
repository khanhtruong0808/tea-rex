import { useEffect } from "react";

export default function NotFound() {
  const currentUrl = window.location.href;
  console.error(currentUrl);
  useEffect(() => {
    const element = document.getElementById("picContainer");

    let translateX = window.innerWidth / 3;

    const animation = setInterval(() => {
      if (translateX > 0) {
        translateX -= 1;
        if (element !== null) {
          element.style.transform = `translateX(${translateX}px)`;
        }
      } else {
        clearInterval(animation);
      }
    }, 1);
    return () => clearInterval(animation);
  });

  return (
    <>
      <div
        id="mainContainer"
        className="flex justify-center items-center pt-24 md:w-full"
      >
        <div className="flex flex-col md:flex-row items-center justify-center mx-4">
          <div className="flex flex-col font- justify-center text-center md:w-64 md:text-left">
            <p className="text-3xl">Tea Rex</p>
            <p className="text-xl py-1">404 Page Not Found</p>
            <p className="">The page you are looking for does not exist.</p>
          </div>
          <div id="picContainer" className="transform">
            <div id="bouncingContainer" className="md:w-96 pt-14 md:pt-1">
              <img
                src="sad-tea-rex.png"
                alt="sad boba t-rea"
                className="bg-transparent"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
