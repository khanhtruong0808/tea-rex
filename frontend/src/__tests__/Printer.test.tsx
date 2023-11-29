import { Printer } from "../components/Printer";

const cartItem = [
  {
    item: {
      price: "1",
      name: "Almond Milk Tea",
    },
    option: [],
    specialInstructions: "",
    quantity: 1,
  },
];

localStorage.setItem("cartItems", JSON.stringify(cartItem));

it("Printer is returning the CloverId", async () => {
  const val = await Printer();
  expect(typeof val).toBe("string");
});
