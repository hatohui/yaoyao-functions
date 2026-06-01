import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: './openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/common/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
