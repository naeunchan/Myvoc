// @ts-check
const { FlatCompat } = require("@eslint/eslintrc");
const prettierPlugin = require("eslint-plugin-prettier");

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

module.exports = [
	{
		ignores: ["node_modules", "dist", "android", "ios"],
	},
	...compat.extends("universe/native", "universe/shared/typescript-analysis", "plugin:react-hooks/recommended", "prettier"),
	{
		plugins: {
			prettier: prettierPlugin,
		},
		languageOptions: {
			globals: {
				jest: "readonly",
			},
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			},
		},
		rules: {
			"prettier/prettier": "error",
			"node/handle-callback-err": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
];
