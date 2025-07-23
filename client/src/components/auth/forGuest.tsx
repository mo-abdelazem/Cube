"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function forGuest(Component) {
  return function Wrapper(props) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "authenticated") {
        router.push("/");
      }
    }, [status, router]);

    if (status === "loading" || status === "authenticated") return null;

    return <Component {...props} />;
  };
}
