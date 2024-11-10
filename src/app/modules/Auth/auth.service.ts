const loginUser = async (payload: { email: string; password: string }) => {
  console.log({payload})
    console.log("user logged in...");
};

export const AuthService = {
  loginUser,
};
