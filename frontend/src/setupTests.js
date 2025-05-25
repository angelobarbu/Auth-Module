/* -----------------  src/setupTests.js  ----------------- */

// --- Web Streams polyfill (Node < 18 or jsdom) ---
if (typeof global.TransformStream === 'undefined') {
  try {
    // Node ≥ 16.8 provides them behind 'stream/web'
    const { ReadableStream, WritableStream, TransformStream } =
      require('node:stream/web');    // alias of 'stream/web'
    global.ReadableStream  = ReadableStream;
    global.WritableStream  = WritableStream;
    global.TransformStream = TransformStream;
  } catch {
    // Older Node – fall back to a ponyfill
    const {
      ReadableStream,
      WritableStream,
      TransformStream,
    } = require('web-streams-polyfill/ponyfill');
    global.ReadableStream  = ReadableStream;
    global.WritableStream  = WritableStream;
    global.TransformStream = TransformStream;
  }
}

// --- TextEncoder / TextDecoder ---
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// afterwards load other libs / MSW
require('@testing-library/jest-dom');          // still works

const { server } = require('./tests/testServer'); // NB: use require, not import
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
