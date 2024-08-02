import { auth } from "@clerk/nextjs/server";

const AdminIds = ["user_2fWpzK49h7EjzdLr4duHNTCg3a2_123"];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) return false;

  return AdminIds.indexOf(userId!) !== -1;
};
