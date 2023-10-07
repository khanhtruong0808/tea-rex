const Rewards = () => {
  return (
    <div>
      <div className="w-9/12 max-w-xl mx-auto">
        <h1 className="font-extrabold text-center text-6xl pb-4 font-menu">
          Rewards
        </h1>
      </div>
      <div className="flex justify-evenly">
        <div className="md:flex pt-2 border-t-2 border-black justify-center">
          <div className="pt-10 flex-col mr-2">
            <h3 className="text-center text-3xl pb-4 font-semibold">
              How they work
            </h3>
            <h3 className="text-center text-xl pt-2">
              Earn 10% back on every order!
            </h3>
            <h3 className="text-center text-xl pt-3">
              After 10 orders you can then spend your rewards or save them!
            </h3>
            <p className="text-center pt-3">
              *Earning based on food and beverage total only.
            </p>
            <p className="text-center pt-3">
              *You have to be logged in to earn a reward.
            </p>
            <p className="text-center text-xl pt-3">Redeem at checkout.</p>
            <div className="flex justify-center">
              <button className="flex origin-center align-center mt-lg rounded-full bg-gradient-to-bl from-amber-600 to-amber-500 px-3 py-1 font-bold mt-4">
                Sign Up
              </button>
            </div>
          </div>
          <div className="flex justify-center md:flex-col mr-1 ml-2 ">
            <img
              className="w-96 mt-1"
              src="https://s3-media0.fl.yelpcdn.com/bphoto/C9n_sfygILUKdQxzTuIiXA/o.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Rewards;
