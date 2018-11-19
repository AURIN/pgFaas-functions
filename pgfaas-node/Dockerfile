#
# Sdapted from OpenFaas node8-express-template
#

FROM node:8.9.4-alpine

RUN addgroup -S app && adduser -S -g app app

# Alternatively use ADD https:// (which will not be cached by Docker builder)
RUN apk --no-cache add curl \
    && echo "Pulling watchdog binary from Github." \
    && curl -sSLf https://github.com/openfaas-incubator/of-watchdog/releases/download/0.4.0/of-watchdog > /usr/bin/fwatchdog \
    && chmod +x /usr/bin/fwatchdog \
    && apk del curl --no-cache

WORKDIR /root/

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /home/app

WORKDIR /home/app

# Copy pgFaas base application
COPY *.* ./
RUN npm i || :

# chmod for tmp is for a buildkit issue (@alexellis)
RUN chown app:app -R /home/app \
    && chmod 777 /tmp

USER app

ENV cgi_headers="true"
#ENV fprocess="node index.js --host ${PGHOST} --port ${PGPORT} --database ${PGDATABASE} --schema ${PGSCHEMA} --user ${PGUSER} --password ${PGPASSWORD} --script ${SCRIPT} --test ${TEST}"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV exec_timeout="300s"
ENV write_timeout="305s"
ENV read_timeout="300s"

HEALTHCHECK --interval=1s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]

