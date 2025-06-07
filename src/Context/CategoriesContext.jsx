import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CategoriesContext = createContext();

export default function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://skilly.runasp.net/api/Category/getAllCategories")
      .then((res) => {
        setCategories(res.data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setLoading(false);
      });
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
}
