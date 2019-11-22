# Dockerfile extending the generic Node image with application files for a
# single application.
# FROM gcr.io/google_appengine/nodejs
# Check to see if the the version included in the base runtime satisfies
# 10.15.3, if not then do an npm install of the latest available
# version that satisfies it.
# RUN /usr/local/bin/install_node 10.15.3
# RUN /usr/local/bin/install_node 10.15.3
# COPY . ./app
# COPY . /app/
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
# RUN npm install --unsafe-perm || \
#   ((if [ -f npm-debug.log ]; then \
#       cat npm-debug.log; \
#     fi) && false)
# CMD npm start

# --- Example --- #
# FROM node:6-alpine

# ADD views /app/views
# ADD package.json /app
# ADD server.js /app

# RUN cd /app; npm install

# ENV NODE_ENV production
# ENV PORT 8080
# EXPOSE 8080

# WORKDIR "/app"
# CMD [ "npm", "start" ]
# -------------- #

# RUN cd /app; npm install

# ENV NODE_ENV development
# ENV PORT 8080
# EXPOSE 8080

# WORKDIR "/app"
# CMD npm run start:linux
# -------------- #

# FROM node:6-alpine
# ADD package.json /app
# ADD index.js /app
# COPY . ./app
# ADD ./src/index.js /app/src
# ADD package.json /app
# ADD index.js /app
# ADD keys.js /app

# RUN cd /app; npm install

# ENV NODE_ENV development
# ENV PORT 8080
# EXPOSE 8080

# WORKDIR "/app"
# CMD npm run start:linux

# -------------------------------- #

# Use the base App Engine Docker image, based on Ubuntu 16.0.4.
FROM gcr.io/gcp-runtimes/ubuntu_16_0_4:latest

# Install updates and dependencies
RUN apt-get update -y && \
    apt-get install --no-install-recommends -y -q \
      apt-transport-https \
      build-essential \
      ca-certificates \
      curl \
      git \
      imagemagick \
      libkrb5-dev \
      netbase \
      python && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm /var/lib/apt/lists/*_*

# Add the files necessary for verifying and installing node.
ADD contents/ /opt/gcp/runtime/
RUN ln -s /opt/gcp/runtime/install_node /usr/local/bin/install_node

# Install the latest LTS release of nodejs directly from nodejs.org
# with the installation aborting if verification of the nodejs binaries fails.
RUN /opt/gcp/runtime/bootstrap_node \
    --direct \
    v10.17.0
ENV PATH $PATH:/nodejs/bin

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main"  >> /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y -q yarn && \
    mkdir -p /opt/yarn/bin && \
    ln -s /usr/bin/yarn /opt/yarn/bin/yarn

# The use of --unsafe-perm is used here so that the installation is done
# as the current (root) user.  Otherwise, a failure in running 'npm install'
# (for example through a failure in a pre-or-post install hook) won't cause
# npm install to have a non-zero exit code.

# Install semver as required by the node version install script.
RUN npm install --unsafe-perm semver

# Set common env vars
ENV NODE_ENV production
ENV PORT 8080

WORKDIR /app

# start
CMD ["npm", "start"]