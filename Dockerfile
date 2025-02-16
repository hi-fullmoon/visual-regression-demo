FROM mcr.microsoft.com/playwright:v1.50.0-noble

RUN apt-get update && apt-get install -y \
    libappindicator3-1 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

COPY ./google-chrome-stable_100_amd64.deb /temp/google-chrome-stable_120_amd64.deb
RUN dpkg -i /temp/google-chrome-stable_120_amd64.deb || apt-get install -f -y

WORKDIR /app

COPY package.json tsconfig.json ./

RUN npm install

EXPOSE 3000

