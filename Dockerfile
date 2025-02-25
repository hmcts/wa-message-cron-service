# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:20-alpine as base
USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .
# RUN yarn install --production \
#   && yarn cache clean
RUN yarn config set httpProxy "$http_proxy" \
    && yarn config set httpsProxy "$https_proxy" \
    && yarn workspaces focus --all --production \
    && rm -rf $(yarn cache clean)

# ---- Build image ----
FROM base as build

USER root
# Remove when switched to dart-sass
RUN apk add --update --no-cache python3
USER hmcts

RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install && yarn build:prod

# ---- Runtime image ----
FROM base as runtime
RUN rm -rf webpack/ webpack.config.js
COPY --from=build $WORKDIR/src/main ./src/main
# TODO: expose the right port for your application
EXPOSE 9988
