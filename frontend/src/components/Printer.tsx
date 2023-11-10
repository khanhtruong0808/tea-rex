import { config } from "../config";

export async function Printer() {
  const apiToken = config.cloverPrinterApiToken;
  const mid = config.cloverMerchantId;

  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "");

  async function main() {
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
          note: string;
        },
      ];
    }

    // let order: Order;
    const order: Order = {
      items: cartItems.map(
        (cartItem: {
          item: { price: string; name: string };
          option: [{ name: string; qty: number }];
          spice: { name: string; qty: number };
          specialInstructions: string;
        }) => ({
          price: cartItem.item.price,
          name: cartItem.item.name,
          options: cartItem.option.map((option) => ({
            name: option.name,
            quantity: option.qty,
          })),
          note: cartItem.specialInstructions,
        }),
      ),
    };

    function addModifications() {
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].spice) {
          order.items[i].options.push({
            name: order.items[i].spice.name,
            qty: 1,
          });
        }
      }
    }
    addModifications();

    const orderTypeOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${apiToken}`,
      },
    };
    const checkOrderType = await fetch(
      `https://sandbox.dev.clover.com/v3/merchants/${mid}/order_types`,
      orderTypeOptions,
    );
    if (!checkOrderType.ok) {
      throw new Error(`Failed to check order type. ${checkOrderType.status}`);
    }
    const func1 = await checkOrderType.json();

    let present = false;
    let pos = -1;
    for (let i = 0; i < func1.elements.length; i++) {
      if (func1.elements[i].label === "online") {
        present = true;
        pos = i;
        break;
      }
    }
    let orderTypeId: number;
    let orderTypeLabel: string;
    if (present) {
      orderTypeId = func1.elements[pos].id;
      orderTypeLabel = func1.elements[pos].label;
    } else {
      const createOrderTypeptions = {
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
      const createOrderType = await fetch(
        `https://sandbox.dev.clover.com/v3/merchants/${mid}/order_types`,
        createOrderTypeptions,
      );
      if (!createOrderType.ok) {
        throw new Error(
          `Failed to create order type. ${createOrderType.status}`,
        );
      }
      const func = await createOrderType.json();
      orderTypeId = func.id;
      orderTypeLabel = func.label;
    }
    const orderOptions = {
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
            note: item.note,
          })),
          currency: "USD",
        },
      }),
    };
    const createOrder = await fetch(
      `https://sandbox.dev.clover.com/v3/merchants/${mid}/atomic_order/orders`,
      orderOptions,
    );
    if (!createOrder.ok) {
      throw new Error(`Failed to create order. ${createOrder.status}`);
    }
    const func2 = await createOrder.json();
    const orderId = func2.id;

    const submitPrintRequest = (oid: string) => {
      //oid == orderId
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ orderRef: { id: oid } }),
      };
      fetch(
        `https://sandbox.dev.clover.com/v3/merchants/${mid}/print_event`,
        options,
      )
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    };
    /*
    Call the print request to actually send the order to the printer
    Commented out since actual printer is not connected and will throw no default printer error
    */
    // submitPrintRequest(orderId);

    return orderId;
  }
  return main();
}
