FROM debian:jessie

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    make \
    libxml2 \
    perltidy \
    rpmlint \
    hlint \
    nodejs \
    npm \
    shellcheck \
    wget \
    git \
    python \
    jq \
    ruby \
    gem \
    python-pip \
    python-dev \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && ln -s /usr/bin/nodejs /usr/bin/node

RUN wget --quiet -O /usr/bin/nigit https://github.com/lukasmartinelli/nigit/releases/download/v0.1-beta/nigit_linux_amd64 \
 && chmod +x /usr/bin/nigit

ENV OCLINT_VERSION=0.10.2
RUN wget --quiet -O /opt/oclint-${OCLINT_VERSION}.tar.gz https://github.com/oclint/oclint/releases/download/v0.10.2/oclint-0.10.2-x86_64-linux-3.13.0-48-generic.tar.gz \
 && tar -xzf /opt/oclint-${OCLINT_VERSION}.tar.gz -C /opt \
 && rm /opt/oclint-${OCLINT_VERSION}.tar.gz \
 && ln -s /opt/oclint-${OCLINT_VERSION}/bin/oclint-${OCLINT_VERSION} /usr/bin/oclint

RUN npm install -g geojsonhint eslint jshint jslint csslint svgo jsonlint \
 && pip install pep8 pyflakes==1.0.0 pylint==1.5.2 flake8==2.5.1 \
 && gem install ruby-lint rubocop puppet-lint scss_lint yaml-lint

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/

EXPOSE 3000
ENV REPO_PATH="/source"
VOLUME /source
CMD ["npm", "start"]
