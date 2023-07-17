const path = require("path")

module.exports = {
  entry: {
    "prompt-receiver": "./src/handlers/prompt.receiver.handler.ts",
    "prompt-processor": "./src/handlers/prompt.processor.handler.ts",
  },
  mode: "production",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "build"),
    libraryTarget: "commonjs2",
  },
}
