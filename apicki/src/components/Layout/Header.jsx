import React, { Fragment } from "react";

import HeaderCartButton from "./HeaderCartButton";

import mealsImg from "../../assets/apiccki.jpeg";
import classes from "./Header.module.css";

const Header = (props) => {
    return (
        <Fragment>
            <header className={classes.header}>
                <h1>Apicki</h1>
                <HeaderCartButton onClick={props.onShowCart} />
            </header>
            <div className={classes["main-image"]}>
                <img src={mealsImg} alt="A table full of delicious food!" />
            </div>
        </Fragment>
    );
};

export default Header;
