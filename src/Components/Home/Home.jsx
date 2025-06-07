import Header from "../Header/Header";
import CategoriesSlider from "./CategorySlider";
import PopularWorks from "./PopularWorks";
import FeaturesSection from "./FeaturesSection";
import { useContext } from "react";
import { AuthContext } from "../../Context/Authcontext";
import Categories from "../Categories/Categories";
import { CategoriesContext } from "../../Context/CategoriesContext";
export default function Home() {
  const { categories } = useContext(CategoriesContext);
  const { userLogin } = useContext(AuthContext);
  return (
    <>
      <Header />
      <main className="my-20 xl:my-32">
        <CategoriesSlider categories={categories} userLogin={userLogin} />
        <PopularWorks />
        <FeaturesSection />
      </main>
    </>
  );
}
