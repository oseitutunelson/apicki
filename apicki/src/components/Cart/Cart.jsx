import { Fragment } from "react";
import { useContext, useState } from "react";
import CartContext from "../store/Cart-Context";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import { supabase } from "../../supabase";

const Cart = (props) => {
  const [isCheckout, setCheckout] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submited, setSubmited] = useState(false);

  const cartContext = useContext(CartContext);

  const totalAmount = `$${cartContext.totalAmount.toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  const cartItemRemoveHadler = (id) => {
    cartContext.removeItem(id);
  };
  const cartItemAddHadler = (item) => {
    cartContext.additem(item);
  };

  const orderHandler = () => {
    setCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmiting(true);
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_data: userData,
          order_items: cartContext.items,
          status: "pending",
          created_at: new Date(),
        },
      ]);
    if (error) {
      alert("Failed to submit order: " + error.message);
      setIsSubmiting(false);
      return;
    }
    // Send SMS notification to admin
    try {
      const adminPhoneNumber = "+233202270671"; // Replace with actual admin phone number
      const message = `New order received from ${userData.name}, Location: ${userData.location}. Order details: ${JSON.stringify(cartContext.items)}`;
      await fetch("/api/sendSms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: adminPhoneNumber,
          message,
        }),
      });
    } catch (smsError) {
      console.error("Failed to send SMS notification:", smsError);
    }
    setIsSubmiting(false);
    setSubmited(true);
    cartContext.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartContext.items.map((item, id) => (
        <CartItem
          key={id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHadler.bind(null, item.id)}
          onAdd={cartItemAddHadler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onSubmit={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </Fragment>
  );

  const isSubmitingModalContent = <p>Sending order data...</p>;

  const submitedModalContent = (
    <Fragment>
      <p>Successfully sent the order</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmiting && !submited && cartModalContent}
      {isSubmiting && isSubmitingModalContent}
      {!isSubmiting && submited && submitedModalContent}
    </Modal>
  );
};

export default Cart;
