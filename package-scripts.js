const npsUtils = require("nps-utils");

const series = npsUtils.series;
const concurrent = npsUtils.concurrent;
const rimraf = npsUtils.rimraf;
const crossEnv = npsUtils.crossEnv;

module.exports = {
  scripts: {
    test: {
      default: crossEnv("NODE_ENV=test jest --coverage"),
      update: crossEnv("NODE_ENV=test jest --coverage --updateSnapshot"),
      watch: crossEnv("NODE_ENV=test jest --watch"),
      codeCov: crossEnv(
        "cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js",
      ),
      size: {
        description: "check the size of the bundle",
        script: "size-limit",
      },
    },
    build: {
      description: "delete the dist directory and run all builds",
      default: series(
        rimraf("dist"),
        concurrent.nps(
          "build.es",
          "build.cjs",
          "build.umd.main",
          "build.umd.min",
        ),
        "tsc --project tsconfig.build.json",
        'echo \'{"name":"react-final-form","main":"react-final-form.cjs.js","module":"react-final-form.es.js","types":"index.d.ts"}\' > dist/package.json',
      ),
      es: {
        description: "run the build with rollup (uses rollup.config.js)",
        script: "rollup --config --environment FORMAT:es",
      },
      cjs: {
        description: "run rollup build with CommonJS format",
        script: "rollup --config --environment FORMAT:cjs",
      },
      umd: {
        min: {
          description: "run the rollup build with sourcemaps",
          script: "rollup --config --sourcemap --environment MINIFY,FORMAT:umd",
        },
        main: {
          description: "builds the cjs and umd files",
          script: "rollup --config --sourcemap --environment FORMAT:umd",
        },
      },
      andTest: series.nps("build", "test.size"),
    },
    docs: {
      description: "Generates table of contents in README",
      script: "doctoc README.md",
    },
    prettier: {
      description: "Runs prettier on everything",
      script: 'prettier --write "**/*.([jt]s*)"',
    },
    lint: {
      description: "lint the entire project",
      script: "eslint .",
    },
    typescript: {
      default: {
        description: "typescript type checking",
        script: "tsc --noEmit",
      },
      definitions: {
        description: "typescript definition tests",
        script: "cd typescript && tsc --noEmit --skipLibCheck",
      },
    },
    validate: {
      description:
        "This runs several scripts to make sure things look good before committing or on clean install",
      default: series(
        "nps build.andTest",
        concurrent.nps("lint", "typescript", "typescript.definitions", "test"),
      ),
    },
  },
  options: {
    silent: false,
  },
};
