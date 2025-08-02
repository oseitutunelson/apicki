import React, { createContext, useState } from "react";
import DUMMY_MEALS from "../Meals/dummy-meals";

export const MealAvailabilityContext = createContext({
  meals: [],
  toggleAvailability: () => {},
});

export const MealAvailabilityProvider = ({ children }) => {
  const [meals, setMeals] = useState(DUMMY_MEALS);

  const toggleAvailability = (id) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === id ? { ...meal, available: !meal.available } : meal
      )
    );
  };

  return (
    <MealAvailabilityContext.Provider value={{ meals, toggleAvailability }}>
      {children}
    </MealAvailabilityContext.Provider>
  );
};
