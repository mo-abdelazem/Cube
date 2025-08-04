import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "CUSTOMER";
      token: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
    token: string;
  }
}
