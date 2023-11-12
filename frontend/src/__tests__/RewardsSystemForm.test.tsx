import { act, render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import { useRewards, RewardsProvider } from "../components/RewardsProvider";
import { RewardsType } from "../components/RewardsContext";
import { AlertProvider } from "../components/AlertMessageContext";
import { useEffect, useState } from "react";
import { ShoppingCartProvider } from "../components/ShoppingCartProvider";

const testBeverageItem: MenuItem = {
  id: 62,
  price: 4.59,
  name: "Almond Milk Tea",
  menuSectionId: 9,
  menuType: "beverage",
};

const testFoodItem: MenuItem = {
  id: 2,
  price: 8.99,
  name: "Orange Chicken",
  menuSectionId: 1,
  menuType: "food",
};

const testRewardsItem: MenuItem = {
  id: 13,
  price: 7.99,
  name: "Popcorn Chicken",
  menuSectionId: 1,
  menuType: "food",
};

it("calculates the discount on the popcorn chicken correctly", async () => {
  const testOption: Item = {
    id: 50,
    name: "Boba",
    price: 0.5,
    qty: 1,
  };

  const testOptions: Item[] = [testOption];

  const testCartItem: CartItem = {
    id: "v0943f2feavj209wm",
    item: testRewardsItem,
    option: testOptions,
    specialInstructions: "",
    quantity: 1,
  };

  const testCart: CartItem[] = [testCartItem];
  const testItemType: RewardsType = "popcorn-chicken";
  const testDiscount: number = 0;
  const testTotalBeverageAmount: number = testCartItem.item.price;

  const TestComponent = () => {
    const { applyDiscountForItem } = useRewards();
    const [testResult, setTestResult] = useState<number | null>(null);

    useEffect(() => {
      const test = async () => {
        const discountResult = await applyDiscountForItem(
          testItemType,
          testCart,
          testDiscount,
          testTotalBeverageAmount,
        );
        console.log(discountResult);
        setTestResult(discountResult);
      };
      test();
    }, []);

    return (
      <div>
        Testing component
        {testResult !== null && (
          <div data-testid="discountResult">{testResult}</div>
        )}
      </div>
    );
  };

  act(() => {
    render(
      <ShoppingCartProvider>
        <AlertProvider>
          <RewardsProvider>
            <TestComponent />
          </RewardsProvider>
        </AlertProvider>
      </ShoppingCartProvider>,
    );
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual(
      testRewardsItem.price.toString(),
    );
  });
});

it("calculates the discount on the beverage items correctly", async () => {
  const testOption: Item = {
    id: 50,
    name: "Boba",
    price: 0.5,
    qty: 1,
  };

  const testOptions: Item[] = [testOption];

  const testCartItem: CartItem = {
    id: "v0943f2feavj209wm",
    item: testBeverageItem,
    option: testOptions,
    specialInstructions: "",
    quantity: 1,
  };

  const testCart: CartItem[] = [testCartItem];
  const testItemType: RewardsType = "drinks";
  const testDiscount: number = 0;
  const testTotalBeverageAmount: number = testCartItem.item.price;

  const TestComponent = () => {
    const { applyDiscountForItem } = useRewards();
    const [testResult, setTestResult] = useState<number | null>(null);

    useEffect(() => {
      const test = async () => {
        const discountResult = await applyDiscountForItem(
          testItemType,
          testCart,
          testDiscount,
          testTotalBeverageAmount,
        );
        console.log(discountResult);
        setTestResult(discountResult);
      };
      test();
    }, []);

    return (
      <div>
        Testing component
        {testResult !== null && (
          <div data-testid="discountResult">{testResult}</div>
        )}
      </div>
    );
  };

  act(() => {
    render(
      <ShoppingCartProvider>
        <AlertProvider>
          <RewardsProvider>
            <TestComponent />
          </RewardsProvider>
        </AlertProvider>
      </ShoppingCartProvider>,
    );
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual(
      testBeverageItem.price.toString(),
    );
  });
});
