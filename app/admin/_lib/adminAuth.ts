export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "admin";

export const adminLogin = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("adminAuthenticated", "true");
    localStorage.setItem(
      "adminUser",
      JSON.stringify({ name: "Admin", email })
    );
    return true;
  }
  return false;
};

export const adminLogout = () => {
  localStorage.removeItem("adminAuthenticated");
  localStorage.removeItem("adminUser");
};

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("adminAuthenticated") === "true";
};

export const getAdminUser = (): { name: string; email: string } | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("adminUser");
  return data ? JSON.parse(data) : null;
};
