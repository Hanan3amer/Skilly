import Categories from "../Categories/Categories";
import { AuthContext } from "../../Context/Authcontext";
import { useContext } from "react";
import { CategoriesContext } from "../../Context/CategoriesContext";
export default function Ourservices() {
  const { userLogin } = useContext(AuthContext);
  const { categories } = useContext(CategoriesContext);
  return <Categories categories={categories} userLogin={userLogin} />;
}
