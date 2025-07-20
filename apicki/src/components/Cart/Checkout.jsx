import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isValidNumber = (value) => /^\d{10}$/.test(value.trim());

const Checkout = (props) => {
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    number: true,
    location: true,
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const nameInputRef = useRef();
  const numberInputRef = useRef();
  const locationInputRef = useRef();

  const confirmHandler = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

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
    //submit the cart data and show success popup
    try {
      await props.onSubmit({
        name: enteredName,
        number: enteredNumber,
        location: enteredLocation,
      });
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to place order: " + error.message);
    }
  };

  const cancelHandler = () => {
    // Cancel the order and redirect to order page
    navigate("/order");
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
