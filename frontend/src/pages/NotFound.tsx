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
        className="flex items-center justify-center pt-24 md:w-full"
      >
        <div className="mx-4 flex flex-col items-center justify-center md:flex-row">
          <div className="font- flex flex-col justify-center text-center md:w-64 md:text-left">
            <p className="text-3xl">Tea Rex</p>
            <p className="py-1 text-xl">404 Page Not Found</p>
            <p className="">The page you are looking for does not exist.</p>
          </div>
          <div id="picContainer" className="transform">
            <div id="bouncingContainer" className="pt-14 md:w-96 md:pt-1">
              <img
                src="/sad-tea-rex.png"
                alt="sad boba t-rex"
                className="bg-transparent"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
