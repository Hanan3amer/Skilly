import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Ourservices from "./Components/Ourservices/Ourservices";
import Aboutus from "./Components/Aboutus/Aboutus";
import Contactus from "./Components/Contactus/Contactus";
import Signin from "./Components/Signin/Signin";
import Signup from "./Components/Signup/Signup";
import Forgotpassword from "./Components/Fogrotpassword/Forgotpassword";
import Accounttype from "./Components/Accounttype/Accounttype";
import { TypeContextProvider } from "./Context/UserType";
import AuthContextprovider from "./Context/Authcontext";
import Serviceprovider from "./Components/Serviceprovider/Serviceprovider";
import Verification from "./Components/Verification/Verification";
import Updatepassword from "./Components/Update/Updatepassword";
import User from "./Components/User/User";
import ServiceProvider from "./Components/Provider/ServiceProvider";
import VerifyEmail from "./Components/VerifyEmail/VerifyEmail";
import Categories from "./Components/Categories/Categories";
import Categoriesdetils from "./Components/Categoriesdetails/Categoriesdetils";
import UserProfile from "./Components/UserProfile/UserProfile";
import UserContextProvider from "./Context/UserContext";
import RequestService from "./Components/RequestService/RequestService";
import Buyservice from "./Components/Buyservice/Buyservice";
import MainProfile from "./Components/ProviderProfile/MainProfile";
import ServiceAddForm from "./Components/RequestService/ServiceAddForm";
import SingleService from "./Components/Serviceprovider/SingleService";
import SingleRequestService from "./Components/Serviceprovider/SingleRequestService";
import ServiceEditForm from "./Components/RequestService/ServiceEditForm";
import SingleChatPage from "./Components/Chat/SingleChatPage";
import MessagesPage from "./Components/Chat/MessagesPage";
import ServiceProviderData from "./Components/ServiceProviderData/ServiceProviderData";
import ServiceDetail from "./Components/ServiceDetail/ServiceDetail";
import OrderDetail from "./Components/OrderDetail/OrderDetail";
import Terms from "./Components/Terms/Terms";
import Praivcy from "./Components/Praivcy/Praivcy";
import ProviderContextProvider from "./Context/ProviderContext";
import Emergency from "./Components/Emergency/Emergency";
import GalleryDemo from "./Components/Demo/GalleryDemo";
import SingleGalleryUser from "./Components/UserProviderProfile/SingleGalleryUser";
import PaymentSuccessPopup from "./Components/Buyservice/PaymentSuccessPopup";
import Rewards from "./Components/Rewards/Rewards";
import { UserDataProvider } from "./Context/UserDataContext";
import DiscountDetail from "./Components/DiscountDetail/DiscountDetail";
import NotificationsModal from "./Components/Notifiction/NotificationModal";
import AllReviews from "./Components/AllReviews/AllReviews";
import ProviderProfileUser from "./Components/UserProviderProfile/ProviderProfileUser";
import { ChatProvider } from "./Context/ChatContext";
import CategoriesProvider from "./Context/CategoriesContext";
import SingleGallery from "./Components/Serviceprovider/SingleGallery";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SingleServiceUser from "./Components/UserProviderProfile/SingleServiceUser";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "categories", element: <Categories /> },
        { path: "categoriesdetails/:id", element: <Categoriesdetils /> },
        { path: "ourservices", element: <Ourservices /> },
        { path: "aboutus", element: <Aboutus /> },
        { path: "contactus", element: <Contactus /> },
        { path: "signin", element: <Signin /> },
        { path: "accounttype", element: <Accounttype /> },
        { path: "signup", element: <Signup /> },
        { path: "user", element: <User /> },
        { path: "provider", element: <ServiceProvider /> },
        { path: "mainprofile", element: <MainProfile /> },
        { path: "verifyemail", element: <VerifyEmail /> },
        { path: "forgotpassword", element: <Forgotpassword /> },
        { path: "userprofile", element: <UserProfile /> },
        { path: "verification", element: <Verification /> },
        { path: "updatepassword", element: <Updatepassword /> },
        { path: "serviceprovider", element: <Serviceprovider /> },
        { path: "requestservice", element: <RequestService /> },
        { path: "addservice", element: <ServiceAddForm /> },
        { path: "service/edit/:id", element: <ServiceEditForm /> },
        { path: "service/:id", element: <SingleService /> },
        { path: "serviceid/:id", element: <SingleServiceUser /> },
        { path: "gallery/:id", element: <SingleGallery /> },
        { path: "galleryid/:id", element: <SingleGalleryUser /> },
        { path: "request/:id", element: <SingleRequestService /> },
        { path: "buyservice", element: <Buyservice /> },
        { path: "notificationsmodal", element: <NotificationsModal /> },
        { path: "messages/:id", element: <SingleChatPage /> },
        { path: "messages", element: <MessagesPage /> },
        { path: "serviceproviderdata", element: <ServiceProviderData /> },
        { path: "orderdetail/:id", element: <OrderDetail /> },
        {
          path: "categoriesdetails/:id/servicedetail/:id",
          element: <ServiceDetail />,
        },
        { path: "Terms", element: <Terms /> },
        { path: "Praivcy", element: <Praivcy /> },
        { path: "emergency", element: <Emergency /> },
        { path: "rewards", element: <Rewards /> },
        { path: "discountdetail/:id", element: <DiscountDetail /> },
        { path: "allreviews/:id", element: <AllReviews /> },
        { path: "gallery-demo", element: <GalleryDemo /> },
        { path: "providerprofileuser/:id", element: <ProviderProfileUser /> },
        { path: "paymentsuccesspopup", element: <PaymentSuccessPopup /> },
      ],
    },
  ]);
  return (
    <>
      <GoogleOAuthProvider clientId="720385409460-tvrhojnr1tfqfor7lserus6mhah8l488.apps.googleusercontent.com">
        <CategoriesProvider>
          <ChatProvider>
            <UserDataProvider>
              <ProviderContextProvider>
                <UserContextProvider>
                  <TypeContextProvider>
                    <AuthContextprovider>
                      <RouterProvider router={router}></RouterProvider>
                    </AuthContextprovider>
                  </TypeContextProvider>
                </UserContextProvider>
              </ProviderContextProvider>
            </UserDataProvider>
          </ChatProvider>
        </CategoriesProvider>
      </GoogleOAuthProvider>
    </>
  );
}
export default App;
