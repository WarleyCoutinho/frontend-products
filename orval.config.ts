import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  fetch: {
    output: {
      target: "./app/_lib/api/fetch-generated/index.ts",
      client: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "./app/_lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
    },
  },
  rc: {
    output: {
      target: "./app/_lib/api/rc-generated/index.ts",
      client: "react-query",
      prettier: true,
      override: {
        mutator: {
          path: "./app/_lib/fetch-client.ts",
          name: "customClientFetch",
        },
      },
    },
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
    },
  },
});
