import merge from 'webpack-merge';
import globby from 'globby';
import HtmlPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';

const isProduction = process.env.NODE_ENV === 'production';

const base: webpack.Configuration = {
	mode: isProduction ? 'production' : 'development',
	devtool: 'cheap-source-map',
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json'],
	},
};

const makeBrowserConfig = (name: string): webpack.Configuration => {
	const entry: webpack.Entry = {};
	const files = globby.sync(`./src/${name}/views/*.tsx`);
	for (const file of files) {
		entry[path.basename(file, '.tsx')] = file;
	}

	return merge(base, {
		entry,
		output: {
			path: path.resolve(__dirname, name),
			filename: '[name].js',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loaders: [
						'babel-loader',
						{loader: 'ts-loader', options: {transpileOnly: true}},
					],
				},
				{
					test: /\.(png|woff2?)$/,
					loader: 'file-loader',
					options: {name: '[name].[ext]'},
				},
				{
					test: /\.css$/,
					loaders: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localsConvention: 'camelCase',
								sourceMap: true,
							},
						},
					],
				},
			],
		},
		plugins: [
			...Object.keys(entry).map(
				(entryName) =>
					new HtmlPlugin({
						filename: `${entryName}.html`,
						chunks: [entryName],
						title: entryName,
						template: `webpack/${name}.html`,
						typekitId: process.env.TYPEKIT_ID,
					}),
			),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
			new BundleAnalyzerPlugin({
				openAnalyzer: false,
				analyzerMode: 'static',
				reportFilename: path.resolve(
					__dirname,
					`bundle-analyzer/${name}.html`,
				),
			}),
		],
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
	});
};

const extensionConfig = merge(base, {
	target: 'node',
	entry: path.resolve(__dirname, 'src/extension/index.ts'),
	output: {
		path: path.resolve(__dirname, 'extension'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {transpileOnly: true},
			},
		],
	},
	externals: [nodeExternals()],
});

const config: webpack.Configuration[] = [
	makeBrowserConfig('dashboard'),
	makeBrowserConfig('graphics'),
	extensionConfig,
];

export default config;
