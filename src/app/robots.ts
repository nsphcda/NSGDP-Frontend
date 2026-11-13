import type { MetadataRoute } from "next";

/** Keep the signed-in and sign-in areas out of search results. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/datasets",
        "/upload",
        "/edit",
        "/profile",
        "/notifications",
        "/downloads",
        "/my-programs",
        "/login",
        "/register",
        "/reset-password",
        "/verify-email",
        "/forgot-password",
      ],
    },
  };
}
