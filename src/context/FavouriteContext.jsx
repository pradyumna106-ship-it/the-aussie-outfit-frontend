import {
  createContext,
  useContext,
  useState
} from "react";

const FavouriteContext =
  createContext();

export function FavouriteProvider({
  children
}) {

  const [favourites, setFavourites] =
    useState([]);

  const toggleFavourite = (product) => {
    setFavourites((prev) =>
      prev.some(
        (p) => p._id === product._id
      )
        ? prev.filter(
            (p) =>
              p._id !== product._id
          )
        : [...prev, product]
    );
  };

  const isFavourite = (id) => {

    return favourites.some(
      (p) => p._id === id
    );
  };
  const fav = favourites
  return (

    <FavouriteContext.Provider
      value={{
        favourites,
        toggleFavourite,
        isFavourite
      }}
    >

      {children}

    </FavouriteContext.Provider>
  );
}

export const useFavourite = () => {

  return useContext(
    FavouriteContext
  );
};