const Rewards = () => {
  return (
    <div>
      <div className="mx-auto w-9/12 max-w-xl">
        <h1 className="font-menu pb-4 text-center text-6xl font-extrabold">
          Rewards
        </h1>
      </div>
      <div className="flex justify-evenly">
        <div className="justify-center border-t-2 border-black pt-2 md:flex">
          <div className="mr-2 flex-col pt-10">
            <h3 className="pb-4 text-center text-3xl font-semibold">
              How they work
            </h3>
            <h3 className="pt-2 text-center text-xl">
              Earn 10% back on every order!
            </h3>
            <h3 className="pt-3 text-center text-xl">
              After 10 orders you can then spend your rewards or save them!
            </h3>
            <p className="pt-3 text-center">
              *Earning based on food and beverage total only.
            </p>
            <p className="pt-3 text-center">
              *You have to be logged in to earn a reward.
            </p>
            <p className="pt-3 text-center text-xl">Redeem at checkout.</p>
            <div className="flex justify-center">
              <button className="align-center mt-lg mt-4 flex origin-center rounded-full bg-gradient-to-bl from-amber-600 to-amber-500 px-3 py-1 font-bold">
                Sign Up
              </button>
            </div>
          </div>
          <div className="ml-2 mr-1 flex justify-center md:flex-col ">
            <img
              className="mt-1 w-96"
              src="https://s3-media0.fl.yelpcdn.com/bphoto/C9n_sfygILUKdQxzTuIiXA/o.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Rewards;
