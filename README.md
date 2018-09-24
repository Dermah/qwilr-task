# qwilr-task

## Prerequesites

You will need:

- [Node](https://nodejs.org)
- [Yarn](https://yarnpkg.com/en/docs/install)

## Install

Install dependencies:

```sh
yarn --cwd charging-bull
yarn --cwd fearless-girl
```

## Run

Run backend:

```sh
yarn --cwd charging-bull start
```

Run frontend:

```sh
yarn --cwd fearless-girl build && yarn --cwd fearless-girl serve -s build
```

## Develop

Run backend with live reload:

```sh
yarn --cwd charging-bull dev
```

Run frontend with live reload:

```sh
yarn --cwd fearless-girl start
```
