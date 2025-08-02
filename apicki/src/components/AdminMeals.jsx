import { useContext } from "react";
import classes from "./AdminMeals.module.css";
import { MealAvailabilityContext } from "./store/MealAvailabilityContext";

const AdminMeals = () => {
  const { meals, toggleAvailability } = useContext(MealAvailabilityContext);

  return (
    <div className={classes.adminMeals}>
      <h2>Manage Meal Availability</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id} className={meal.available ? "" : classes.unavailable}>
            <span>{meal.name}</span>
            <button onClick={() => toggleAvailability(meal.id)}>
              {meal.available ? "Mark as Unavailable" : "Mark as Available"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMeals;
