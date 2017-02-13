
## install

Clone the repo:
```sh
git clone https://github.com/BusinessDuck/noveo.git
cd noveo
```

Install tools:
```js
npm install -g istanbul coveralls commitizen
```

Install yarn:
```js
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

## start server

Run server:
```sh
# Start server
yarn start

## tests

Tests:
```sh
# Run tests written in ES6 along with code coverage
yarn test

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

