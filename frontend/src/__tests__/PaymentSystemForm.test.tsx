import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { RewardsProvider } from "../components/RewardsProvider";
import { AlertProvider } from "../components/AlertMessageContext";
import { useEffect, useRef, useState } from "react";
import { ShoppingCartProvider } from "../components/ShoppingCartProvider";
import { config } from "../config";
import { MemoryRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/forms/PaymentForm";

const stripePromise = loadStripe(config.stripePublicKey);

interface MockStripeElementProps {
  onChange: (event: { complete: boolean }) => void;
}

vi.mock("@stripe/react-stripe-js", async () => {
  const actual: any = await vi.importActual("@stripe/react-stripe-js");

  const mockElement = () => ({
    mount: vi.fn(),
    unmount: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    update: vi.fn(),
  });

  interface MockedElements {
    [key: string]: ReturnType<typeof mockElement>;
  }
  const mockStripe = () => ({
    elements: vi.fn(() => mockElements()),
    createToken: vi.fn(),
    createSource: vi.fn(),
    createPaymentMethod: vi.fn(),
    confirmCardPayment: vi.fn(),
    confirmCardSetup: vi.fn(),
    paymentRequest: vi.fn(),
    _registerWrapper: vi.fn(),
  });

  const mockElements = () => {
    const elements: MockedElements = {};
    return {
      create: vi.fn((type: string) => {
        elements[type] = mockElement();
        return elements[type];
      }),
      getElement: vi.fn((type: string) => {
        return elements[type] || null;
      }),
      update: vi.fn(),
    };
  };

  const MockCardNumberElement = ({ onChange }: MockStripeElementProps) => (
    <input
      placeholder="1234 1234 1234 1234"
      onChange={(event) =>
        onChange({ complete: event.target.value.length >= 16 })
      }
    />
  );
  const MockCardExpiryElement = ({ onChange }: MockStripeElementProps) => (
    <input
      placeholder="MM / YY"
      onChange={(event) =>
        onChange({ complete: event.target.value.length >= 5 })
      }
    />
  );
  const MockCardCvcElement = ({ onChange }: MockStripeElementProps) => (
    <input
      placeholder="CVC"
      onChange={(event) =>
        onChange({ complete: event.target.value.length >= 3 })
      }
    />
  );

  return {
    ...actual,
    CardNumberElement: MockCardNumberElement,
    CardExpiryElement: MockCardExpiryElement,
    CardCvcElement: MockCardCvcElement,
    Element: () => {
      return mockElement();
    },
    useStripe: () => {
      return mockStripe();
    },
    useElements: () => {
      return mockElements();
    },
  };
});

const TestComponent = () => {
  const [mockIsCheckingOut, mockSetIsCheckingOut] = useState(false);
  const mockHandleCancel = () => {
    mockSetIsCheckingOut(false);
  };
  const [mockIsLoading, mockSetLoading] = useState(false);
  const mockHandleSubmitRef = useRef<(() => Promise<void>) | null>(null);
  const [triggerSubmit, setTriggerSubmit] = useState(false);

  useEffect(() => {
    if (triggerSubmit && mockHandleSubmitRef.current) {
      mockHandleSubmitRef.current();
    }
  }, [triggerSubmit]);

  return (
    <MemoryRouter>
      <Elements stripe={stripePromise}>
        <ShoppingCartProvider>
          <AlertProvider>
            <RewardsProvider>
              <PaymentForm
                cancelCheckout={mockHandleCancel}
                setLoading={mockSetLoading}
                setHandleSubmit={(func) => (mockHandleSubmitRef.current = func)}
              />
              <button
                data-testid="test-submit"
                onClick={() => setTriggerSubmit(true)}
              >
                Test Submit
              </button>
            </RewardsProvider>
          </AlertProvider>
        </ShoppingCartProvider>
      </Elements>
    </MemoryRouter>
  );
};

it("renders PaymentForm with mock Stripe elements", () => {
  render(<TestComponent />);
  expect(
    screen.getByPlaceholderText("1234 1234 1234 1234"),
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText("MM / YY")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("CVC")).toBeInTheDocument();
});
