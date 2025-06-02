import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { getUserType } from "../utils/hooks/getUserType";
export const ProviderContext = createContext();

export default function ProviderContextProvider(props) {
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [providerServices, setProviderServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userType = getUserType();

    if (token && userType === 1) {
      getProviderData(token);
    }
  }, []);

  function getProviderData(forceRefresh = false) {
    const token = localStorage.getItem("userToken");
    if (providerData && !forceRefresh) return Promise.resolve(providerData);
    if (providerData) return Promise.resolve(providerData);
    if (!token) {
      console.log("No token available for provider data fetch");
      return Promise.reject("No authentication token");
    }

    setLoading(true);

    return axios
      .get(
        `https://skilly.runasp.net/api/Provider/GetServiceProviderByUserId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Provider API Response:", response.data);
        if (response.data && response.data.provider) {
          setProviderData(response.data.provider);
          console.log("Provider data set:", response.data.provider);
          localStorage.setItem(
            "providerData",
            JSON.stringify(response.data.provider)
          );
        }
        setLoading(false);
        return response;
      })
      .catch((err) => {
        console.log("Get Provider Error:", err.response || err.message || err);
        setLoading(false);
        return err;
      });
  }

  function addProvider(formData) {
    const token = localStorage.getItem("userToken");
    return axios
      .post(
        `https://skilly.runasp.net/api/Provider/addServiceProvider`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          getProviderData();
        }
        return response;
      })
      .catch((err) => {
        console.log("Add Provider Error:", err.response || err.message || err);
        return err;
      });
  }

  function refreshProviderData() {
    const token = localStorage.getItem("userToken");
    const userType = localStorage.getItem("userType");

    if (token && userType === "1") {
      console.log("Manually refreshing provider data...");
      return getProviderData(true);
    }
    return Promise.resolve(null);
  }

  function getProviderServices() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.log("No token available for services fetch");
      return Promise.reject("No authentication token");
    }

    // If services are already loaded and not empty, return them
    if (providerServices && providerServices.length > 0) {
      console.log("Using cached provider services");
      return Promise.resolve({ services: providerServices });
    }

    // Only set loading if we're actually making a request
    setServicesLoading(true);

    return axios
      .get(
        `https://skilly.runasp.net/api/Provider/ProviderServices/GetAllServicesByproviderId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setServicesLoading(false);
        console.log(response.data);
        response.data.service = response.data.service.map((service) => ({
          ...service,
          images: service.images.map((image) => image?.img),
        }));
        setProviderServices(response.data);
        setServicesLoading(false);
        return response.data;
      })
      .catch((err) => {
        console.log(
          "Get Provider Services Error:",
          err.response || err.message || err
        );
        setServicesLoading(false);
        return Promise.reject(err);
      });
  }

  function getServicesByProviderId(providerId) {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.log("No token available for services fetch");
      return Promise.reject("No authentication token");
    }

    return axios
      .get(
        `https://skilly.runasp.net/api/Provider/ProviderServices/GetAllServicesByAnother/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => {
        console.log(
          "Get Services By ProviderId Error:",
          err.response || err.message || err
        );
        return Promise.reject(err);
      });
  }

  function getProviderDataById(userId) {
    const token = localStorage.getItem("userToken");

    if (!token) {
      console.log("No token available for provider data fetch by ID");
      return Promise.reject("No authentication token");
    }

    return axios
      .get(
        `https://skilly.runasp.net/api/Provider/GetServiceProviderBy/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Provider data by ID response:", response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(
          "Get Provider By ID Error:",
          err.response || err.message || err
        );
        return Promise.reject(err);
      });
  }
  return (
    <ProviderContext.Provider
      value={{
        addProvider,
        providerData,
        loading,
        getProviderData: refreshProviderData,
        providerServices,
        servicesLoading,
        getProviderServices,
        getServicesByProviderId,
        getProviderDataById,
      }}
    >
      {props.children}
    </ProviderContext.Provider>
  );
}
