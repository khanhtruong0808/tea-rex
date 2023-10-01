import { useEffect, useState } from "react";
import { config } from "../config";

export default function Printer() {
  const apiToken = config.cloverPrinterApiToken;
  const mid = "CVMBG5FBAFSF1"; //merchant ID

  interface Order {
    orderId: string;
    // email: string,
    items: [
      {
        amount: number;
        description: string;
      },
    ];
  }

  const [order, setOrder] = useState<Order>({
    orderId: "",
    // email: '',
    items: [
      {
        amount: 1,
        description: "food",
      },
    ],
  });

  const submitPrintRequest = (oid: string) => {
    //oid = orderId
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ orderRef: { id: oid } /*, id: id*/ }),
    };
    fetch(
      `https://sandbox.dev.clover.com/v3/merchants/${mid}/print_event`,
      options,
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  // // order needs to be created before you can send a printRequest to the printer
  const createOrder = (order: Order) => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        currency: "USD",
        // email: order.email,
        items: order.items.map((item) => ({
          amount: item.amount,
          description: item.description,
          // inventory_id: order.items.inventory_id
        })),
      }),
    };
    fetch(`https://sandbox.dev.clover.com/v3/merchants/${mid}/orders`, options)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res)
        submitPrintRequest(res.id);
      })
      .catch((err) => console.error(err));
  };

  return (
    // this button was used for testing
    <>
      <div>
        <button onClick={() => createOrder(order)}>print order</button>
      </div>
    </>
  );
}

// createOrder(order)
