/* eslint-env node */
import lwcCompiler from "@lwc/rollup-plugin";
import replace from "rollup-plugin-replace";
import fs from "fs-extra";
import path from "path";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import workbox from "rollup-plugin-workbox-build";
import { transform } from "@babel/core";
import babelTsPlugin from "@babel/plugin-transform-typescript";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const projectPackage = require("./package.json");

const distFolderName = "dist";
const dist = path.resolve(__dirname, `./${distFolderName}`);
const publicFolder = path.resolve(__dirname, "src", "public");
const swPath = path.resolve(dist, "sw.js");

const environment = process.env.build || "development";
const isProduction = environment === "production";

const babelOptions = {
    babelrc: false,
    plugins: [babelTsPlugin],
    parserOpts: {
        plugins: [
            ["decorators", { decoratorsBeforeExport: true }],
            ["classProperties", {}]
        ]
    }
};

function removeTypesPlugin() {
    return {
        name: "ts-removal",
        transform(src, id) {
            if (path.extname(id) === ".ts") {
                const { code, map } = transform(src, babelOptions);
                return { code, map };
            }
        }
    };
}

console.log(`DETECTED ENVIRONMENT: ${environment}`);

// Start with clean dist folder
fs.removeSync(dist);

// Copy public folder
fs.copySync(publicFolder, dist);

// build a workbox version since index.html pulls it in directly
const workBoxModule = path.resolve(
    __dirname,
    "./node_modules",
    "workbox-window",
    "Workbox.mjs"
);
const workboxBundle = {
    input: workBoxModule,
    output: {
        file: `${distFolderName}/workbox.js`,
        format: "esm"
    },
    plugins: [
        resolve({
            modulesOnly: true
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(environment)
        }),
        isProduction && terser({ sourcemap: false })
    ].filter(Boolean)
};

const index = {
    input: "./src/index.ts",
    output: {
        file: `${distFolderName}/bundle.js`,
        format: "esm"
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(environment),
            "process.env.ENVIRONMENT": JSON.stringify(environment),
            "process.env.RELEASE_VERSION": JSON.stringify(
                projectPackage.version
            ),
            "process.env.RELEASE_DATE": JSON.stringify(
                new Date().toLocaleDateString("en-US")
            )
        }),
        removeTypesPlugin(),
        lwcCompiler({
            stylesheetConfig: { customProperties: { allowDefinition: true } },
            rootDir: path.join(__dirname, "./src/modules")
        }),
        resolve({
            modulesOnly: true
        }),
        workbox({
            mode: "generateSW",
            options: {
                swDest: swPath,
                globDirectory: dist,
                globPatterns: ["**/*.{js,css,html,png,svg}"]
            }
        }),
        isProduction && terser({ sourcemap: false })
    ].filter(Boolean)
};

const about = {
    input: "./src/about.ts",
    output: {
        file: `${distFolderName}/about/about.js`,
        format: "esm"
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(environment),
            "process.env.ENVIRONMENT": JSON.stringify(environment),
            "process.env.RELEASE_VERSION": JSON.stringify(
                projectPackage.version
            ),
            "process.env.RELEASE_DATE": JSON.stringify(
                new Date().toLocaleDateString("en-US")
            )
        }),
        removeTypesPlugin(),
        lwcCompiler({
            stylesheetConfig: { customProperties: { allowDefinition: true } },
            rootDir: path.join(__dirname, "./src/modules")
        }),
        resolve({
            modulesOnly: true
        }),
        isProduction && terser({ sourcemap: false })
    ].filter(Boolean)
};

// keep index last in the array so workbox build runs last
export default [workboxBundle, about, index];
