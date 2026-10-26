# Amazon project tests (Jasmine)

The test suite runs on Node with Jasmine and jsdom. It covers the data layer,
utilities, and the browser-facing page scripts.

## Run the tests

From the repository root:

```bash
npm install
npm test
```

You can also run `npm run test:amazon`.

## Browser runner

`tests.html` is the optional in-browser Jasmine runner. Serve the project root
(for example with `npm run serve`) and open:

```text
http://localhost:8080/Mini_Projects/amazon/tests-jasmine/tests.html
```

## What is covered

- `data/`: cart (module, class, and factory versions), delivery options,
  orders, and products.
- `scripts/`: Amazon product grid and search, orders page, tracking page,
  checkout entry point, order summary, and payment summary.
- `utils/`: currency formatting.

`data/backend-practice.js` is a browser-only XMLHttpRequest demo and is not
unit tested.

## Notes

- `helpers/jsdom.js` creates the browser environment and resets the page and
  storage before each spec.
- `helpers/fixtures.js` contains the shared product/order fixtures.
- Product and cart modules expose their classes/functions so they can be
  imported directly by the specs.
