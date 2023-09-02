import { useState, useEffect } from "react";
import { axiosPrivate } from '../apis/backend';

const useFetchData = (endpoint, { title, retryButton, alertActions = [] } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    // Rest states
    setLoading(true);
    setAlert(null);
    setData(null);
    // Add default retry button if requested
    const actions = [];
    // Deep copy so default retry function is not added to alertActions arg
    for (const action of alertActions) actions.push(action);
    if (retryButton) actions.push({ name: "Retry", onClick: () => { fetchData() } });

    try {
      let response = await axiosPrivate.get(endpoint);
      setData(response?.data);
    } catch (error) {
      setAlert({
        severity: error?.response?.data?.alertSeverity ? error.response.data.alertSeverity : "error",
        title: ("Oops! Unable to load " + ((title && title) || "content") + ": " + (error?.response?.data?.errCode || "Unknown error")),
        message: (error?.response?.data?.errMsg ? error?.response?.data?.errMsg : "We're sorry, but we are unable to load " + ((title && title) || "your requested content") + " at this time. Please try again later"),
        actions: actions
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, alert, reFetch: fetchData };
}

export default useFetchData;