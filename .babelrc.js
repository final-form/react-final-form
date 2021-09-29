const { NODE_ENV } = process.env;
const test = NODE_ENV === "test";
const loose = true;

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose,
        ...(test ? { targets: { node: "8" } } : {}),
      },
    ],
    "@babel/preset-react",
    "@babel/preset-flow",
  ],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    test && "@babel/plugin-transform-react-jsx-source",
  ].filter(Boolean),
};
