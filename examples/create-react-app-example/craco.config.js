module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: false,
          https: require.resolve("agent-base"),
          http: require.resolve("agent-base"),
        },
      },
    },
  },
}
