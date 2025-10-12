const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);

	if (env.mode === "production") {
		const publicPath = process.env.EXPO_PUBLIC_BASE_PATH ?? "/myvoc/";
		// Ensure emitted asset URLs resolve correctly on GitHub Pages.
		config.output = config.output || {};
		config.output.publicPath = publicPath.endsWith("/") ? publicPath : `${publicPath}/`;
	}

	config.experiments = {
		...(config.experiments || {}),
		asyncWebAssembly: true,
	};

	config.module.rules.push({
		test: /\.wasm$/,
		type: "asset/resource",
	});

	return config;
};
