import { useContext } from "react";
import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";
import { MealAvailabilityContext } from "../store/MealAvailabilityContext";

const AvailableMeals = () => {
  const { meals } = useContext(MealAvailabilityContext);

  const mealsList = meals
    .filter((meal) => meal.available)
    .map((meal) => (
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
        available={meal.available}
      />
    ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
