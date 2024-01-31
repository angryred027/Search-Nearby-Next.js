/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    scope: "/app",
    sw: "/public/sw.js",
  });
  
  export default withPWA({
    // Your Next.js config
  });
