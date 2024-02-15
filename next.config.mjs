import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    register: false,
    cacheOnFrontEndNav: true,
});
         
export default withSerwist({
    // Your Next.js config
    env: {
        MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
        MAPS_TOKEN: process.env.MAPS_TOKEN,
    },
});