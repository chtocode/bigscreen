import { useRouter } from "next/router";
import { useEffect } from "react";
import storage, { UserInfo } from "../../lib/services/storage";

export function useLoginState(): UserInfo {
  const router = useRouter();

  useEffect(() => {
    if (!storage.token) {
      router.push("/login", undefined, { shallow: true });
    }

    console.log("-======", router.pathname);

    if (router.pathname === "/dashboard") {
      router.push(`/dashboard/risk`, undefined, { shallow: true });
    }
  }, []);

  return storage.userInfo;
}
