import { render, screen } from "@testing-library/react";
import { AddItemForm } from "../components/AddItemForm";

it("displays beverage modal correctly", () => {
  const testItem: MenuItem = {
    id: 62,
    price: 4.59,
    name: "Almond Milk Tea",
    menuSectionId: 9,
    menuType: "beverage",
  };
  render(<AddItemForm selectedItem={testItem} />);
  const title = screen.queryByText("Almond Milk Tea");
  expect(title).toBeVisible();

  const cupSize = screen.queryByText("Cup Size");
  expect(cupSize).toBeVisible();

  const addBobaJelly = screen.queryByText("Add Boba Jelly");
  expect(addBobaJelly).toBeVisible();

  const iceLevel = screen.queryByText("Ice Level");
  expect(iceLevel).toBeVisible();

  const sugarLevel = screen.queryByText("Sugar Level");
  expect(sugarLevel).toBeVisible();
});

it("displays food modal correctly", () => {
  const testItem: MenuItem = {
    id: 13,
    price: 7.99,
    name: "Popcorn Chicken",
    menuSectionId: 1,
    menuType: "food",
  };
  render(<AddItemForm selectedItem={testItem} />);
  const title = screen.queryByText("Popcorn Chicken");
  expect(title).toBeVisible();

  const sauceField = screen.queryByText("Choice of Sauce");
  expect(sauceField).toBeVisible();

  const spicy = screen.queryByText("Spicy");
  expect(spicy).toBeVisible();
});
