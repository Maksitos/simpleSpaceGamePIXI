import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Mode = 'production' | 'development'
interface EnvVariables {
    mode: Mode
}
export default(env: EnvVariables) => {
    return {
        mode : env.mode ?? 'development',
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        module: {
            rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },

        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'build'),
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public', 'index.html'),}),
            new webpack.ProgressPlugin(),
        ],
        devServer: {
            port: 3000,
            open: true,
        },
    }
};
