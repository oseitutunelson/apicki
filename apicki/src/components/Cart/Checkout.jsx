import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isValidNumber = (value) => /^\d{10}$/.test(value.trim());

const Checkout = (props) => {
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    number: true,
    location: true,
  });

  const navigate = useNavigate();

  const nameInputRef = useRef();
  const numberInputRef = useRef();
  const locationInputRef = useRef();

  // Load Paystack script dynamically
  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("paystack-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "paystack-script";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const payWithPaystack = async (userData, amount) => {
    const res = await loadPaystackScript();
    if (!res) {
      alert("Failed to load Paystack SDK. Please try again later.");
      return false;
    }

    return new Promise((resolve, reject) => {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK,
        email: "apicki@gmail.com", // placeholder email since user/email removed
        amount: amount * 100, // Paystack expects amount in kobo
        currency: "GHS",
        channels: ["mobile_money", "card", "bank"],
        metadata: {
          custom_fields: [
            {
              display_name: "Mobile Number",
              variable_name: "mobile_number",
              value: userData.number,
            },
          ],
        },
        callback: function (response) {
          // Payment successful
          resolve(response);
        },
        onClose: function () {
          // Payment cancelled
          reject(new Error("Payment cancelled"));
        },
      });
      handler.openIframe();
    });
  };

  const confirmHandler = async (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredNumber = numberInputRef.current.value;
    const enteredLocation = locationInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredNumberIsValid = isValidNumber(enteredNumber);
    const enteredLocationIsValid = !isEmpty(enteredLocation);

    setFormInputValidity({
      name: enteredNameIsValid,
      number: enteredNumberIsValid,
      location: enteredLocationIsValid,
    });

    const formIsValid =
      enteredNameIsValid && enteredNumberIsValid && enteredLocationIsValid;

    if (!formIsValid) {
      return;
    }

    // Calculate total amount from props or context
    const amount = props.totalAmount || 0;

    try {
      // Trigger Paystack payment
      await payWithPaystack(
        {
          name: enteredName,
          number: enteredNumber,
          location: enteredLocation,
        },
        amount
      );
      // On successful payment, submit order
      await props.onSubmit({
        name: enteredName,
        number: enteredNumber,
        location: enteredLocation,
      });
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      alert("Payment failed or cancelled: " + error.message);
    }
  };

  const cancelHandler = () => {
    // Cancel the order and close the modal
    if (props.onCancel) {
      props.onCancel();
    } else {
      navigate("/order");
    }
  };

  //css classes
  const nameControlClasses = `${classes.control} ${
    formInputValidity.name ? "" : classes.invalid
  }`;
  const numberControlClasses = `${classes.control} ${
    formInputValidity.number ? "" : classes.invalid
  }`;
  const locationControlClasses = `${classes.control} ${
    formInputValidity.location ? "" : classes.invalid
  }`;

  return (
    <div className={classes.checkoutContainer}>
      <h2>Checkout</h2>
      <form className={classes.form} onSubmit={confirmHandler}>
        <div className={nameControlClasses}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" ref={nameInputRef} placeholder="John Doe" />
          {!formInputValidity.name && <p className={classes.error}>Please enter a valid name!</p>}
        </div>
        <div className={numberControlClasses}>
          <label htmlFor="number">Phone Number</label>
          <input type="text" id="number" ref={numberInputRef} placeholder="1234567890" />
          {!formInputValidity.number && (
            <p className={classes.error}>Please enter a valid 10-digit phone number!</p>
          )}
        </div>
        <div className={locationControlClasses}>
          <label htmlFor="location">Shipping Address</label>
          <textarea id="location" ref={locationInputRef} placeholder="123 Main St, City, Country" />
          {!formInputValidity.location && <p className={classes.error}>Please enter a valid address!</p>}
        </div>
        <div className={classes.actions}>
          <button type="button" onClick={cancelHandler} className={classes.cancelButton}>
            Cancel Order
          </button>
          <button type="submit" className={classes.confirmButton}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
