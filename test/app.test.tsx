/**
 * Website smoke tests, run with `bun test` (see scripts/test.sh).
 *
 * The site is a single client-rendered page that reads `window.location.hash`
 * at render time and fetches nothing. Rendering it to a string with
 * react-dom/server gives a real check of both facts without a DOM library or a
 * new dependency: if a component reached for the network or for a browser API
 * that is not stubbed here, the render throws.
 */
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

type Stub = { location: { hash: string }; addEventListener: () => void; removeEventListener: () => void; scrollTo: () => void };

const stubWindow = (hash: string): void => {
  const stub: Stub = {
    location: { hash },
    // useState/useEffect never run effects under renderToStaticMarkup, but the
    // handlers must exist for the code that registers them to stay importable.
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
  };
  (globalThis as unknown as { window: Stub }).window = stub;
};

const renderAt = async (hash: string): Promise<string> => {
  stubWindow(hash);
  const { default: App } = await import("../src/App");
  return renderToStaticMarkup(<App />);
};

describe("website", () => {
  test("renders the overview at the default hash", async () => {
    const html = await renderAt("");
    expect(html).toContain("Times shape your wealth, mind secures your control.");
    expect(html).toContain("Built around practical money records");
    expect(html).toContain("The current project map");
    expect(html).toContain('aria-label="Primary navigation"');
  });

  test("renders the API reference from the hash route", async () => {
    const html = await renderAt("#/api-reference");
    expect(html).toContain("API Reference");
    expect(html).toContain("/api/v1 contract");
    expect(html).toContain("POST /cash/expense");
  });

  test("renders the CLI reference from the hash route", async () => {
    const html = await renderAt("#/cli-reference");
    expect(html).toContain("CLI Reference");
    expect(html).toContain("go run main.go");
  });

  test("falls back to the overview for an unknown route", async () => {
    const html = await renderAt("#/does-not-exist");
    expect(html).toContain("Built around practical money records");
    expect(html).not.toContain("Complete route surface");
  });

  test("renders without touching the network", async () => {
    (globalThis as unknown as { fetch: () => never }).fetch = () => {
      throw new Error("the website must render from its own content, not from a request");
    };
    const html = await renderAt("");
    expect(html.length).toBeGreaterThan(1000);
  });
});
