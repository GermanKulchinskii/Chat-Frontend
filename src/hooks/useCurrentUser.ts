
import { useEffect } from "react";
import { useCurrentQuery } from "@/services/authApi";
import { useAppDispatch } from "@/store/store";
import { authActions } from "@/store/Auth";
import { userIdSelector, usernameSelector } from "@/store/Auth/selector";
import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  
  const userId = useSelector(userIdSelector);
  const username = useSelector(usernameSelector);

  const { data, isFetching, isError } = useCurrentQuery(undefined, {
    skip: !!userId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data?.current) {
      const currentUser = data.data.current;
      dispatch(authActions.setUserInfo({
        username: currentUser.username,
        userId: currentUser.id,
      }));
    }
  }, [data, dispatch]);

  return { userId, username, isFetching, isError };
};
