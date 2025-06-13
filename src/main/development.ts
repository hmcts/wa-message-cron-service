import * as express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config';

const setupDev = (app: express.Express, developmentMode: boolean): void => {
  if (developmentMode) {
    const webpackDev = webpackDevMiddleware;
    const webpackconfig = webpackConfig;
    const compiler = webpack(webpackconfig);
    app.use(
      webpackDev(compiler, {
        publicPath: '/',
      })
    );
  }
};

module.exports = { setupDev };
