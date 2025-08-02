import { useContext } from "react";
import CartContext from "../../store/Cart-Context";
import classes from "./MealItem.module.css";
import MealItemForm from "./MealItemForm";

const MealItem = (props) => {
    const cartContext = useContext(CartContext);
    const price = `₵${(props.price !== undefined ? props.price : 0).toFixed(2)}`;

    const addToCartHandler = (amount) => {
        cartContext.additem({
            id: props.id,
            name: props.name,
            amount: amount,
            price: props.price !== undefined ? props.price : 0,
        });
    };

    return (
        <li className={classes.meal}>
            <div>
                <h3>{props.name}</h3>
                <div className={classes.description}>{props.description}</div>
                <div className={classes.price}>{price}</div>
            </div>
            {props.available ? (
                <MealItemForm onAddToCart={addToCartHandler} />
            ) : (
                <p style={{ color: "red", fontWeight: "bold" }}>Unavailable</p>
            )}
        </li>
    );
};

export default MealItem;
