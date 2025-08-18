import path from 'path';
import 'webpack-dev-server';
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

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
            // publicPath: '/simpleSpaceGamePIXI/',
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public', 'index.html'),}),
            new CopyWebpackPlugin({patterns: [{ from: "public", to:"", globOptions: { ignore: ["**/index.html"] } }]})
        ],
        devServer: {
            port: 3000,
            open: true,
        },
    }
};
