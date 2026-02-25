import api from "../services/api";
import { getAuth } from "firebase/auth";

export const getMe = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Not logged in");

  const token = await user.getIdToken();

  return api.get("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
