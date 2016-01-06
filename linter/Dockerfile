FROM debian:jessie

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    hlint \
    nodejs \
    npm \
    shellcheck \
    wget \
    git \
    python \
    ruby \
    gem \
    python-pip \
    python-dev \
    ca-certificates \
    python-demjson \
 && rm -rf /var/lib/apt/lists/* \
 && ln -s /usr/bin/nodejs /usr/bin/node

RUN wget --quiet -O /usr/bin/nigit https://github.com/lukasmartinelli/nigit/releases/download/v0.1-beta/nigit_linux_amd64 \
 && chmod +x /usr/bin/nigit

ENV OCLINT_VERSION=0.10.2
RUN wget --quiet -O /opt/oclint-${OCLINT_VERSION}.tar.gz https://github.com/oclint/oclint/releases/download/v0.10.2/oclint-0.10.2-x86_64-linux-3.13.0-48-generic.tar.gz \
 && tar -xzf /opt/oclint-${OCLINT_VERSION}.tar.gz -C /opt \
 && rm /opt/oclint-${OCLINT_VERSION}.tar.gz \
 && ln -s /opt/oclint-${OCLINT_VERSION}/bin/oclint-${OCLINT_VERSION} /usr/bin/oclint

RUN npm install -g geojsonhint \
 && pip install pep8 pyflakes==1.0.0 pylint==1.5.2 flake8==2.5.1 \
 && gem install ruby-lint rubocop

COPY . /usr/src/app/
WORKDIR /usr/src/app

EXPOSE 8000
CMD ["nigit", "--timeout", "20", "json.sh", "haskell.sh", "geojson.sh", "shell.sh", "pep8.sh", "ruby-lint.sh", "rubocop.sh", "pylint.sh", "flake8.sh", "pyflakes.sh"]
