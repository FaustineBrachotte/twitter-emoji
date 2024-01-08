import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
//import { ClerkProvider } from "node_modules/@clerk/nextjs/dist/types/components.server";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
