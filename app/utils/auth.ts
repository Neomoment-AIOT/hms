export type User = {
  name: string;
  email: string;
};

export const loginFake = (email: string, password: string): User | null => {
  if (email === "admin@gmail.com" && password === "admin") {
    const user = {
      name: "Admin User",
      email,
    };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
};

export const logoutFake = () => {
  localStorage.removeItem("user");
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};