import { nodeResolve } from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
// import pkg from "./package.json" assert { type: "json" };
// Hardcode version to avoid import issues
const pkg = {
  version: "6.5.9",
  dependencies: {
    "@babel/runtime": "^7.15.4",
  },
  peerDependencies: {
    "final-form": "^5.0.0-0",
    react: "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
  },
};

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
};

const minify = process.env.MINIFY;
const format = process.env.FORMAT;
const es = format === "es";
const umd = format === "umd";
const cjs = format === "cjs";

let output;

if (es) {
  output = { file: `dist/react-final-form.es.js`, format: "es" };
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/react-final-form.umd.min.js`,
      format: "umd",
    };
  } else {
    output = { file: `dist/react-final-form.umd.js`, format: "umd" };
  }
} else if (cjs) {
  output = { file: `dist/react-final-form.cjs.js`, format: "cjs" };
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`);
} else {
  throw new Error("no format specified. --environment FORMAT:xxx");
}

export default {
  input: "src/index.ts",
  output: Object.assign(
    {
      name: "react-final-form",
      exports: "named",
      globals: {
        react: "React",
        "final-form": "FinalForm",
      },
    },
    output,
  ),

  external: makeExternalPredicate(
    umd
      ? Object.keys(pkg.peerDependencies || {})
      : [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ],
  ),
  plugins: [
    nodeResolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    json(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [["@babel/plugin-transform-runtime", { useESModules: !cjs }]],
      babelHelpers: "runtime",
    }),
    umd
      ? replace({
          "process.env.NODE_ENV": JSON.stringify(
            minify ? "production" : "development",
          ),
          preventAssignment: true,
        })
      : null,
    minify ? terser() : null,
  ].filter(Boolean),
};
