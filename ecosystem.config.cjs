module.exports = {
  apps: [
    {
      name: "hris-frontend",
      script: "npx",
      args: "serve -s dist -l 8081",
      env_staging: {
        NODE_ENV: "staging",
        VITE_API_BASE_URL: "http://staging-hris.btmlimited.net"
      }
    }
  ]
}
