import { useContext, useEffect } from "react";
import { UserContext } from "../context/usecontext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosintance";
import { APIpaths } from "../utils/apiPath";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    let mounted = true;

    const fetchingapi = async () => {
      try {
        const response = await axiosInstance.post(APIpaths.AUTH.GETUSERINFO);
        if (mounted && response.data?.data) {
          updateUser(response.data.data);
        }
      } catch (error) {
        console.log("User fetch failed:", error.message);
        clearUser();
        navigate("/login");
      }
    };

    fetchingapi();

    return () => {
      mounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};
