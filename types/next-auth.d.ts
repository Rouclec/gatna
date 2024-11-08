// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

// Extend the default session type to include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add `id` to the session user
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: string;
    } & DefaultSession["user"]; // Combine with default properties
  }

  interface User {
    id: string; // Add `id` to the user model
    role: string;
  }

  interface JWT {
    id: string;
    role: string;
  }
}
