import { useState, useEffect } from "react";
import { axiosPrivate } from '../apis/backend';

const useFetchData = (endpoint, retry) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Rest states
      setData(null);
      setLoading(true);
      setAlert(null);
      // Set default retry function if not provided
      const retryFunction = retry || fetchData;

      try {
        let response = await axiosPrivate.get(endpoint);
        setData(response?.data);
      } catch (error) {
        setAlert({
          severity: error?.response?.data?.alertSeverity ? error.response.data.alertSeverity : "error",
          title: ("Oops! We've encountered an error: " + (error?.response?.data?.errCode || "Unknown error")),
          message: (error?.response?.data?.errMsg ? error?.response?.data?.errMsg : "We're sorry, but we are unable to process your request at this time. Please try again later"),
          actions: [{ name: "Retry", onClick: () => { retryFunction() } }]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, loading, alert };
}

export default useFetchData;