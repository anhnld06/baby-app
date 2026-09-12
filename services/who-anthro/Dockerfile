FROM rocker/r-ver:4.4.3

RUN sed -i 's|http://|https://|g' /etc/apt/sources.list.d/ubuntu.sources \
    && apt-get -o Acquire::Retries=5 update \
    && apt-get -o Acquire::Retries=5 install -y --no-install-recommends libcurl4-openssl-dev libicu-dev libsodium-dev libssl-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get -o Acquire::Retries=5 update \
    && apt-get -o Acquire::Retries=5 install -y --no-install-recommends zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

RUN R -e "packages <- c('anthro', 'jsonlite', 'plumber'); install.packages(packages, repos='https://cloud.r-project.org'); stopifnot(all(vapply(packages, requireNamespace, logical(1), quietly=TRUE)))"

WORKDIR /app
COPY plumber.R /app/plumber.R

EXPOSE 8082
CMD ["R", "-e", "api <- plumber::plumb('/app/plumber.R'); api$run(host='0.0.0.0', port=8082)"]
