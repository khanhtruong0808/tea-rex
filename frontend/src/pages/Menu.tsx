import React, { useState } from 'react';
import Modal from 'react-modal';

const Menu = () => {

  const snackItemsFixed = [
    {name: 'Teriyaki Chicken', price: 8.99},
    {name: 'Orange Chicken', price: 8.99},
    {name: 'Sweet & Fire Chicken', price: 8.99},
    {name: 'French Fries', price: 3.99},
    {name: 'Sweet Potato Fries', price: 4.99},
    {name: 'Lobster Ball(6 pieces)', price: 7.99},
    {name: 'Golden Cute Bun(4 Pieces)', price: 4.49},
    {name: 'Fried Dumpling(6 Pieces)', price: 8.99},
    {name: 'Fried Dumpling(12 Pieces)', price: 13.99},
    {name: 'Steam Dumpling(6 Pieces)', price: 8.99},
    {name: 'Steam Dumpling(12 Pieces)', price: 13.99},
    {name: 'Potsticker(12 pieces)', price: 14.99},
  ];

  const snackItemsVariable = [
    {name: 'Popcorn Chicken', price: 7.99},
    {name: 'Fried Calamari', price: 9.99},
    {name: 'Cream Cheese Rangon(3 pieces)', price: 4.99},
    {name: 'Tarto Fries', price: 5.99},
    {name: 'Mozzarella Cheese Sticks(5 pcs)', price: 5.99},
    {name: 'Fish Ball(10 pieces)', price: 4.99},
    {name: 'Firm Tofu (Fried)', price: 6.99},
    {name: 'Veggie Spring Roll(5 pieces)', price: 5.99},
    {name: 'Tempura Shrimp(2 pieces)', price: 4.99},
    {name: 'Tempura Shrimp(4 pieces)', price: 7.99},
  ];

  const musubiItems = [
    { name: 'Spam Musubi', price: 2.99 },
    { name: 'Grilled Chicken Musubi', price: 2.99 },
    { name: 'Pork Belly Musubi', price: 2.99 },
    { name: 'Crab Meat Musubi', price: 2.99 },
    { name: 'Tofu Musubi', price: 2.99 },
  ];

  const bentoItems = [
    { name: 'Pork Belly + Taro Bento', price: 13.99 },
    { name: 'Popcorn Chicken Bento', price: 11.99 },
    { name: 'Orange Chicken Bento', price: 11.99 },
    { name: 'Crab Meat Musubi', price: 11.99 },
    { name: 'Teriyaki Chicken Bento', price: 11.99 },
    { name: 'Sweet & Fire Chicken Bento', price: 11.99 },
    { name: 'Fried Calamari Bento', price: 13.99 },
    { name: 'Salmon Teriyaki Bento', price: 14.99 },
  ];

  const ramenchowItemsFixed = [
    { name: 'Chicken Ramen Chowmein', price: 12.99 },
    { name: 'Spam Ramen Chowmein', price: 12.99 },
    { name: 'Veggie Ramen Chowmein', price: 12.99 },
    { name: 'Udon(Stir Fried) w/ Grilled Chicken', price: 13.99 },
    { name: 'Udon(Stir Fried) w/ Spam', price: 13.99 },
    { name: 'Udon(Stir Fried) w/ Pork Belly', price: 13.99 },
    { name: 'Udon(Stir Fried) w/ Veggie', price: 13.99 },
  ];

  const ramenchowItemsVariable = [
    { name: 'Pork Ramen Chowmein', price: 12.99 },
  ];

  const sushiItemsFixed = [
    { name: 'California Roll (Sesame)', price: 8.99 },
    { name: 'Crunch Roll (Mayo/Crunch Onion)', price: 9.99 },
    { name: 'Spicy Crunch Roll (Spicy Mayo/Crunch Onion)', price: 9.99 },
    { name: 'Honey Wasabi Crunch Roll', price: 9.99 },
  ];

  const sushiItemsVariable = [
    { name: 'Tempura Shrimp Roll', price: 11.99 },
  ];

  const pokeItems = [
    { name: 'Mewtwo', price: 16.99 },
    { name: 'Charizard', price: 12.99 },
    { name: 'Squirtle', price: 16.99 },
  ];

  const ramenItems = [
    { name: 'Tonkotsu (Only Broth + Noodles)', price: 8.99 },
    { name: 'Spicy Ramen (Choice of Protein)', price: 8.99 },
    { name: 'Miso Ramen (Choice of Protein)', price: 8.99 },
    { name: 'Seafood Ramen', price: 16.99 },
  ];

  const ricesoupItemsFixed = [
    { name: 'Miso Soup', price: 3.99 },
    { name: 'Purple Mixed Rice', price: 2.99 },
    { name: 'Steam Rice', price: 2.50 },
    { name: '1/2 Purple | 1/2 White Rice', price: 2.99 },
  ];

  const ricesoupItemsVariable = [
    { name: 'Fresh Mix Salad', price: 2.99 },
  ];

  const milkteaItems = [
    { name: 'Almond Milk Tea', price: 4.59 },
    { name: 'Okinawa (Black Sugar) Milk Tea', price: 4.59 },
    { name: 'Chocolate Milk Tea', price: 4.59 },
    { name: 'Coffee Milk Tea', price: 4.59 },
    { name: 'Coconut Milk Tea', price: 4.59 },
    { name: 'Grape Milk Tea', price: 4.59 },
    { name: 'Green Apple Milk Tea', price: 4.59 },
    { name: 'Guava Milk Tea', price: 4.59 },
    { name: 'Honeydew Milk Tea', price: 4.59 },
    { name: 'Honey Milk Tea', price: 4.59 },
    { name: 'Honey Green Milk Tea', price: 4.59 },
    { name: 'Jasmine Green Milk Tea', price: 3.99 },
    { name: 'Kiwi Milk Tea', price: 4.59 },
    { name: 'Lychee Milk Tea', price: 4.59 },
    { name: 'Mango Milk Tea', price: 4.59 },
    { name: 'Matcha Green Milk Tea', price: 4.59 },
    { name: 'Matcha Black Milk Tea', price: 4.59 },
    { name: 'Milk Tea', price: 3.99 },
    { name: 'Passion Fruit Milk Tea', price: 4.59 },
    { name: 'Peach Milk Tea', price: 4.59 },
    { name: 'Rose Milk Tea', price: 4.59 },
    { name: 'Sesame Chocolate Milk Tea', price: 4.99 },
    { name: 'Strawberry Milk Tea', price: 4.59 },
    { name: 'Taro Milk Tea', price: 4.59 },
    { name: 'Thai Milk Tea', price: 3.99 },
    { name: 'Tiger Milk Tea', price: 3.99 },
    { name: 'Wintermelon Milk Tea', price: 4.59 },
    { name: 'Oolong Milk Tea', price: 3.99 },
  ];

  const flavorpureteaItems = [
    { name: 'Green Tea', price: 3.69 },
    { name: 'Black Tea', price: 3.69 },
    { name: 'Wintermelon Tea', price: 3.99 },
    { name: 'Fresh Lemon Black Tea', price: 4.69 },
    { name: 'Fresh Lemon Green Tea', price: 4.69 },
    { name: 'Grape Green Tea', price: 3.99 },
    { name: 'Grape Black Tea', price: 3.99 },
    { name: 'Green Apple Green Tea', price: 3.99 },
    { name: 'Green Apple Black Tea', price: 3.99 },
    { name: 'Guava Green Tea', price: 3.99 },
    { name: 'Guava Black Tea', price: 3.99 },
    { name: 'Honey Green Tea', price: 3.99 },
    { name: 'Honey Black Tea', price: 3.99 },
    { name: 'Kiwi Green Tea', price: 3.99 },
    { name: 'Kiwi Black Tea', price: 3.99 },
    { name: 'Lychee Green Tea', price: 3.99 },
    { name: 'Lychee Black Tea', price: 3.99 },
    { name: 'Mango Green Tea', price: 3.99 },
    { name: 'Mango Black Tea', price: 3.99 },
    { name: 'Passion Fruit Green Tea', price: 3.99 },
    { name: 'Passion Fruit Black Tea', price: 3.99 },
    { name: 'Peach Green Tea', price: 3.99 },
    { name: 'Peach Black Tea', price: 3.99 },
    { name: 'Rose Green Tea', price: 3.99 },
    { name: 'Rose Black Tea', price: 3.99 },
    { name: 'Strawberry Green Tea', price: 3.99 },
    { name: 'Strawberry Black Tea', price: 3.99 },
  ];

  const notsosecretItems = [
    { name: 'The Loco Mango Slush', price: 5.49},
    { name: 'Strawberry Shortcake Slush', price: 4.99},
    { name: 'Kiwi-Strawberry Slush', price: 4.99},
    { name: 'Matcha Man Slush', price: 4.99},
    { name: 'Pina Colada Slush', price: 4.99},
    { name: 'Nut-TEA-lla Milk Tea (24oz)', price: 4.99},
    { name: 'Nut-TEA-lla Slush', price: 4.99},
    { name: 'Chocolate Lava Java Slush', price: 4.99},
  ];

  const slushyItems = [
    { name: 'Almond Slushy', price: 4.99},
    { name: 'Avocado Slushy', price: 5.99},
    { name: 'Coconut Slushy', price: 4.99},
    { name: 'Chocolate Slushy', price: 4.99},
    { name: 'Coffee Slushy', price: 4.99},
    { name: 'Grape Slushy', price: 4.99},
    { name: 'Green Apple Slushy', price: 4.99},
    { name: 'Honeydew Slushy', price: 4.99},
    { name: 'Kiwi Slushy', price: 4.99},
    { name: 'Lychee Slushy', price: 4.99},
    { name: 'Mango Slushy', price: 4.99},
    { name: 'Matcha Slushy', price: 4.99},
    { name: 'Passion Fruit Slushy', price: 4.99},
    { name: 'Peach Slushy', price: 4.99},
    { name: 'Strawbery Slushy', price: 4.99},
    { name: 'Taro Slushy', price: 4.99},
    { name: 'Thai Tea Slushy', price: 4.99},
  ];

  const sodaItems = [
    { name: 'Coke', price: 1.99},
    { name: '7-Up', price: 1.99},
    { name: 'Dr. Pepper', price: 1.99},
    { name: 'Bottled Water', price: 1.00},
    { name: 'Water', price: 0.50},
  ];

  const watermelonItems = [
    { name: 'Fresh Watermelon Juice (24oz)', price: 4.99},
    { name: 'Fresh Watermelon Slushy (24oz)', price: 5.49},
    { name: 'Fresh Watermelon Strawberry Slushy', price: 5.99},
  ];

  const mojitoItems = [
    { name: 'Hibiscus Mojito', price: 4.99},
    { name: 'Kiwi Mojito', price: 4.99},
    { name: 'Lemon Mojito', price: 4.99},
    { name: 'Mango Mojito', price: 4.99},
    { name: 'Strawberry Mojito', price: 4.99},
  ];

  const paradiseItems = [
    { name: 'Fresh Fruit Paradise Tea', price: 5.89},
  ];

  const butterflyItems = [
    { name: 'Green Mango Butterfly (24oz)', price: 5.89},
    { name: 'Mango Butterfly', price: 5.89},
    { name: 'Passion Fruit Butterfly', price: 5.89},
    { name: 'Pineapple Butterfly', price: 5.89},
    { name: 'Strawberry Butterfly', price: 5.89},
  ];

  const partyItems = [
    { name: 'Large Tray (10 orders) Popcorn Chicken', price: 69.99},
    { name: 'Large Tray (10 orders) French Fries', price: 33.99},
    { name: '1 Cup Cotton Candy', price: 1.50},
  ];

  /*const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    setShowModal(true);
  };*/

  /*const handleAddToCart = () => {
    setShowModal(true);
  };*/                                    //_____________ORIGINAL

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const handleAddToCart = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  const [quantity, setQuantity] = useState(1);
  
  const selectedItemDetails = selectedItem ? (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 id="modalTitle" className="text-2xl font-bold">{selectedItem.name}</h2>
        <button className="text-gray-400 hover:text-gray-800 text-4xl" onClick={handleCloseModal}>&#10005;</button>
      </div>
      <hr className="bg-black border-black h-0.5 mb-4"></hr>
      <div className="px-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-2">Quantity:</h3>
          <div className="flex items-center">
            <button className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-l" onClick={() => setQuantity(Math.max(quantity - 1, 1))}> - </button>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(parseInt(e.target.value), 1))} className="w-12 text-center"/>
            <button className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-r" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Choice of Sauce<span className="text-gray-400 text-sm font-normal"> (up to 1 max)</span></h3>
          <hr className="border-gray-300 mb-4"></hr>
          <div className="flex flex-col">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Salt &amp; Pepper On Side</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Sauce on the Side</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Extra 2nd Sauce</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Ranch</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Sweet Red Chili</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Orange Sauce</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Tea Rex Special Sauce (BBQ) </span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Hoisin Sauce</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Garlic Sauce</span>
            </label>
          <div className ="flex flex-col ml-6">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Spicy on Side</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Extra 1st Sauce +$0.50</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Extra 3rd Sauce +$0.50</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Sweet & Sour</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Teriyaki</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Spicy Mayo</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Honey Wasabi</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
              <span className="ml-2 text-gray-700">Dumpling Sauce</span>
            </label>
            {/* Add more sauce choices here */}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;   
  
  /*const styles = {
    modal: {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', // adjust the width as needed
        height: '90%', // adjust the height as needed
        maxWidth: '700px',
        maxHeight: '700px',
        overflow: 'auto'
      },
    },
  };  */

  const styles = {
    modal: {
      content: 
      "top-1/2 left-1/2 right-auto bottom-auto -mr-1/2 transform translate-x-1/2 -translate-y-1/2 w-90 h-90 max-w-700 max-h-700 overflow-auto",
    },
  };

  return (
    <>
      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Snack</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://cdn.shopify.com/s/files/1/0595/3850/5936/articles/20221127144116-taiwanese-popcorn-chicken.png?v=1669560530" alt="Popcorn Chicken" />
        {snackItemsFixed.map((item: { name: string, price: number}, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p>
            <p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}</p>
            <button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </article>
        ))}
        {snackItemsVariable.map((item: { name: string, price: number}, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p>
            <p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p>
            <button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </article>
        ))}
      </div>
      <Modal isOpen={showModal} onRequestClose={handleCloseModal} style={styles.modal}>
        {selectedItemDetails}
      </Modal>
      
      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Musubi</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://polynesia.com/blog/wp-content/uploads/2018/08/Musubi-pic-from-the-WolfPit.jpg" alt="Spam Musubi" />
        {musubiItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p>
            <p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p>
            <button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </article>
        ))}
      </div>
      <Modal isOpen={showModal} onRequestClose={handleCloseModal} style={styles.modal}>
        {selectedItemDetails}
      </Modal>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Bento Box</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://japanexpressaz.com/wp-content/uploads/2014/08/Japan-Express_Salmon-Teriyaki.jpg" alt="Salmon Teriyaki Bento Box" />
        {bentoItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Ramen Chowmein</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://www.recipetineats.com/wp-content/uploads/2019/06/Chow-Mein-Ramen_3.jpg?w=480&h=270&crop=1" alt="Chicken Ramen Chowmein" />
        {ramenchowItemsFixed.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
        {ramenchowItemsVariable.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Sushi</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/2d22de36cfd2d0e47bfa7680da03c61e.jpg" alt="Tempura Shrimp Roll" />
        {sushiItemsFixed.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
        {sushiItemsVariable.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Poke Bowl</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/a0e4839313630d7354c00f3cfb95fbe9.jpg" alt="Squirtle Poke Bowl" />
        {pokeItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Ramen<br></br>(Noodle Soup)</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://cdn.shopify.com/s/files/1/0111/1729/7722/articles/shutterstock_697241275_tonkotsu_ramen-landscape.jpg?v=1562316760" alt="Tonkotsu Ramen" />
        {ramenItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Rice | Soup</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://www.pressurecookrecipes.com/wp-content/uploads/2021/05/miso-soup.jpg" alt="Miso Soup" />
        {ricesoupItemsFixed.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price.toFixed(2)}</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
        {ricesoupItemsVariable.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Milk Tea</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/ef00e6a3646c564ed11f3d70294e93e1.png" alt="Milk Tea on a Table" />
        {milkteaItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Flavor | Tea</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/39448ef1a7ca3bc328c4811a1717cf73.png" alt="Honey Green Tea and Peach Green Tea on a table" />
        {flavorpureteaItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Not So Secret Drink</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/d8116893a552288f6e667663a4fd6cb9.png" alt="The Loco Mango Slushy" />
        {notsosecretItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Slushy</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/e866b2c3a6c85e9d6eb490c3714c29c8.jpg" alt="Passionfruit, Strawberry, and Taro Slushies on a table" />
        {slushyItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Soda</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://www.thedailymeal.com/img/gallery/16-oldest-soda-brands-that-are-still-on-the-market/l-intro-1674496494.jpg" alt="Variety of Soda" />
        {sodaItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price.toFixed(2)}</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Watermelon Juice | Slushy</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/490771347263bd9c6e6af7cc4ce4c182.jpg" alt="Fresh Watermelon Juice" />
        {watermelonItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-5xl pb-4 font-menu">Mojito 24 Oz Only<br></br>(Green Tea Base)</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/560f6f518745ffcf77a13fadd5c7ee6b.png" alt="Mango Mojito" />
        {mojitoItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Fresh Fruit Paradise Tea</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/c07ba31c8be002717a4c4ceced19adf0.jpg" alt="Fresh Fruit Paradise Tea" />
        {paradiseItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Butterfly Layer</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://i.gyazo.com/b4a9495a49bd450842c58e06c9a62a9f.jpg" alt="Mango Butterfly Layer Tea" />
        {butterflyItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price}+</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

      <div className="w-9/12 mx-auto p-5 max-w-lg">
        <h2 className="font-extrabold text-center text-6xl pb-4 font-menu">Party Tray</h2>
        <hr className="bg-black border-black h-0.5"></hr>
        <img className="object-contain self-start float-left mt-1 w-96 mb-2" src="https://vietchef.com/media/food/69/popcorn-chicken-party-platter-2669.jpg" alt="Large Party Tray Popcorn Chicken" />
        {partyItems.map((item, index) => (
          <article key={index} className="my-2">
            <p className="text-left w-3/6 self-center inline-block font-semibold">{item.name}</p><p className="text-right w-1/4 pr-4 self-center inline-block font-semibold">${item.price.toFixed(2)}</p><button className="text-right bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 pb-1 rounded-full">Add to Cart</button>
          </article>
        ))}
      </div>

    </>
  );
};

export default Menu;
