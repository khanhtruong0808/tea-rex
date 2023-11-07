import { config } from "../config";

export function Printer() {
  const apiToken = config.cloverPrinterApiToken;
  const mid = config.cloverMerchantId;

  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "");

  interface Order {
    items: [
      {
        price: string;
        name: string;
        options: [
          {
            name: string;
            qty: number;
          },
        ];
        spice: {
          name: string;
        };
      },
    ];
  }

  const order: Order = {
    items: cartItems.map(
      (cartItem: {
        item: { price: string; name: string };
        option: [{ name: string; qty: number }];
        spice: { name: string; qty: number };
      }) => ({
        price: cartItem.item.price,
        name: cartItem.item.name,
        options: cartItem.option.map((option) => ({
          name: option.name,
          quantity: option.qty,
        })),
      }),
    ),
  };

  // adding spice option to order
  const addModifications = () => {
    for (let i = 0; i < order.items.length; i++) {
      if (order.items[i].spice) {
        order.items[i].options.push({
          name: order.items[i].spice.name,
          qty: 1,
        });
      }
    }
    checkOrderType();
  };

  // 1
  function checkOrderType() {
    console.log(order);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${apiToken}`,
      },
    };

    fetch(
      `https://sandbox.dev.clover.com/v3/merchants/${mid}/order_types`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        let present = false;
        let pos: number = -1;
        for (let i = 0; i < res.elements.length; i++) {
          if (res.elements[i].label === "online") {
            present = true;
            pos = i;
            break;
          }
        }
        // create orderType if does not exist
        if (present) {
          createOrder(order, res.elements[pos].id, res.elements[pos].label);
          present = false;
        } else {
          createOrderType();
        }
      })
      .catch((err) => console.error(err));
  }

  const createOrderType = () => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        taxable: "false",
        isDefault: "false",
        filterCategories: "false",
        isHidden: "false",
        isDeleted: "false",
        label: "online",
      }),
    };

    fetch(
      `https://sandbox.dev.clover.com/v3/merchants/${mid}/order_types`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        createOrder(order, res.id, res.label);
      })
      .catch((err) => console.error(err));
  };

  const createOrder = (
    order: Order,
    orderTypeId: string,
    orderTypeLabel: string,
  ) => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        orderCart: {
          orderType: {
            taxable: "false",
            isDefault: "false",
            filterCategories: "false",
            isHidden: "false",
            isDeleted: "false",
            label: orderTypeLabel,
            id: orderTypeId,
          },
          groupLineItems: "false",
          lineItems: order.items.map((item) => ({
            printed: "false",
            exchange: "false",
            refunded: "false",
            refund: {
              transactionInfo: {
                isTokenBasedTx: "false",
                emergencyFlag: "false",
              },
            },
            isRevenue: "false",
            name: item.name,
            price: parseFloat(item.price),
            modifications: item.options.map((option) => ({
              modifier: {
                available: "true",
                name: option.name,
              },
              amount: option.qty,
            })),
            note: cartItems.item.specialInstructions,
          })),
          currency: "USD",
        },
      }),
    };
    fetch(
      `https://sandbox.dev.clover.com/v3/merchants/${mid}/atomic_order/orders`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // submitPrintRequest(res.id);
      })
      .catch((err) => console.error(err));
  };

  // Unsure if we're using this, commenting out for now -KT
  // const submitPrintRequest = (oid: string) => {
  //   //oid == orderId
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //       "content-type": "application/json",
  //       authorization: `Bearer ${apiToken}`,
  //     },
  //     body: JSON.stringify({ orderRef: { id: oid } }),
  //   };
  //   fetch(
  //     `https://sandbox.dev.clover.com/v3/merchants/${mid}/print_event`,
  //     options,
  //   )
  //     .then((res) => res.json())
  //     .then((res) => console.log(res))
  //     .catch((err) => console.error(err));
  // };

  addModifications();

  return <div></div>;
}
