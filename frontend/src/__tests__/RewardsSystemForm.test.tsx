import { act, render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import { useRewards, RewardsProvider } from "../components/RewardsProvider";
import { RewardsType } from "../components/RewardsContext";
import { AlertProvider } from "../components/AlertMessageContext";
import { useEffect, useState } from "react";
import { ShoppingCartProvider } from "../components/ShoppingCartProvider";

interface SetupTestEnvironmentProps {
  testCart: CartItem[];
  testItemType: RewardsType;
  testDiscount: number;
  testTotalBeverageAmount: number;
  quantity?: number;
}

const setupTestEnvironment = ({
  testCart,
  testItemType,
  testDiscount,
  testTotalBeverageAmount,
  quantity,
}: SetupTestEnvironmentProps) => {
  const TestComponent = () => {
    const { applyDiscountForItem } = useRewards();
    const [testResult, setTestResult] = useState<number | null>(null);
    if (quantity == undefined) {
      useEffect(() => {
        const test = async () => {
          const result = await applyDiscountForItem(
            testItemType,
            testCart,
            testDiscount,
            testTotalBeverageAmount,
          );
          setTestResult(result);
        };
        test();
      }, []);
    } else {
      useEffect(() => {
        const test = async () => {
          let currentResult = 0;
          for (let i = 0; i < quantity; i++) {
            const discountResult = await applyDiscountForItem(
              testItemType,
              testCart,
              testDiscount,
              testTotalBeverageAmount,
            );
            currentResult += discountResult;
          }
          setTestResult(Number(currentResult.toFixed(2)));
        };
        test();
      }, []);
    }

    return (
      <div>
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
};

const testBeverageItem: MenuItem = {
  id: 62,
  price: 4.59,
  name: "Almond Milk Tea",
  menuSectionId: 9,
  menuType: "beverage",
};

const testRewardsItem: MenuItem = {
  id: 13,
  price: 7.99,
  name: "Popcorn Chicken",
  menuSectionId: 1,
  menuType: "food",
};

const testFoodItem: MenuItem = {
  id: 42,
  price: 12.99,
  name: "Charizard",
  menuSectionId: 1,
  menuType: "food",
};

const testOption: Item = {
  id: 50,
  name: "Boba",
  price: 0.5,
  qty: 1,
};

const testOptions: Item[] = [testOption];
it("calculates the discount on the beverage items correctly", async () => {
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
  const testTotalBeverageAmount: number =
    testCartItem.item.price * testCartItem.quantity;

  setupTestEnvironment({
    testCart: testCart,
    testItemType: testItemType,
    testDiscount: testDiscount,
    testTotalBeverageAmount: testTotalBeverageAmount,
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual(
      testBeverageItem.price.toString(),
    );
  });
});

it("calculates the discount on the beverage items more than $6 correctly", async () => {
  const testCartItem: CartItem = {
    id: "v0943f2feavj209wm",
    item: testBeverageItem,
    option: testOptions,
    specialInstructions: "",
    quantity: 2,
  };

  const testCart: CartItem[] = [testCartItem];
  const testItemType: RewardsType = "drinks";
  const testDiscount: number = 0;
  const testTotalBeverageAmount: number =
    testCartItem.item.price * testCartItem.quantity;

  setupTestEnvironment({
    testCart: testCart,
    testItemType: testItemType,
    testDiscount: testDiscount,
    testTotalBeverageAmount: testTotalBeverageAmount,
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual("6");
  });
});

it("calculates the discount on the popcorn chicken correctly", async () => {
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
  const testTotalBeverageAmount: number = 0;

  setupTestEnvironment({
    testCart: testCart,
    testItemType: testItemType,
    testDiscount: testDiscount,
    testTotalBeverageAmount: testTotalBeverageAmount,
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual(
      testRewardsItem.price.toString(),
    );
  });
});

it("calculates the discount on multiple popcorn chicken correctly", async () => {
  const testCartItem: CartItem = {
    id: "v0943f2feavj209wm",
    item: testRewardsItem,
    option: testOptions,
    specialInstructions: "",
    quantity: 50,
  };

  const testCart: CartItem[] = [testCartItem];
  const testItemType: RewardsType = "popcorn-chicken";
  const testDiscount: number = 0;
  const testTotalBeverageAmount: number = 0;

  setupTestEnvironment({
    testCart: testCart,
    testItemType: testItemType,
    testDiscount: testDiscount,
    testTotalBeverageAmount: testTotalBeverageAmount,
    quantity: testCartItem.quantity,
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual(
      (testCartItem.quantity * testRewardsItem.price).toString(),
    );
  });
});

it("rejects items that are not part of the rewards system", async () => {
  const testOption: Item = {
    id: 50,
    name: "Boba",
    price: 0.5,
    qty: 1,
  };

  const testOptions: Item[] = [testOption];

  const testCartItem: CartItem = {
    id: "v0943f2feavj209wm",
    item: testFoodItem,
    option: testOptions,
    specialInstructions: "",
    quantity: 1,
  };

  const testCart: CartItem[] = [testCartItem];
  const testItemType: RewardsType = "popcorn-chicken";
  const testDiscount: number = 0;
  const testTotalBeverageAmount: number = 0;

  setupTestEnvironment({
    testCart: testCart,
    testItemType: testItemType,
    testDiscount: testDiscount,
    testTotalBeverageAmount: testTotalBeverageAmount,
  });

  await waitFor(() => {
    expect(screen.getByTestId("discountResult").textContent).toEqual("-2");
  });
});
