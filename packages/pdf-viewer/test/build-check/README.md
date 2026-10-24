# PDF Viewer build check

This folder checks the viewer in a production build, served with the Content Security Policy
of the package README. The check is not part of `yarn test`. The unit test runner only picks up
`packages/*/test/*.test.{js,ts}`.

Run the check:

- At the end of a release cycle, before an experimental or stable release.
- In every pdf.js upgrade PR. Paste the report into the PR description.

## Automated check

Run from the repository root:

```sh
node packages/pdf-viewer/test/build-check/check.js
```

The script exits with code 1 when a run fails. It needs the Playwright browsers:
`npx playwright install chromium firefox webkit`.

The script does these steps:

1. Build `index.html` and `main.js` with Vite into `dist/`. The app imports `@vaadin/pdf-viewer`
   and shows file 05 of `dev/assets/pdf/`. With `?assets`, it shows file 01 and sets `assetsUrl`
   to `/pdfjs-dist/`. The build uses the Vite defaults, except that it is not minified.
2. Copy the folders `cmaps/`, `standard_fonts/`, `wasm/` and `iccs/` of `pdfjs-dist` into
   `dist/pdfjs-dist/`.
3. Serve `dist/` with the policy of the package README. The server answers Range requests, and
   it sends no-store caching headers.
4. Open the app in Chromium, Firefox and WebKit, once for each policy:
   - **README**: the policy of the package README.
   - **README + `'wasm-unsafe-eval'`**: the optional directive for WebAssembly.
   - **README, `assetsUrl`** and **README + `'wasm-unsafe-eval'`, `assetsUrl`**: the same
     policies, with `?assets`.
   - **control: `worker-src 'none'`**: proves that the check sees violations. The viewer must fire
     `document-error` with the reason `network` and must not hang.
5. In each run, open the sidebar and the find bar, then call `download()` and `print()`. The
   script replaces the print dialog, so that it can count the page images that loaded.
6. Print a Markdown report.

The report has one row for each engine and policy:

| Column            | Pass value                                                         |
| ----------------- | ------------------------------------------------------------------ |
| Load              | `loaded`, or `error (network)` in the control run                  |
| Worker            | `module`, with one running worker thread                           |
| Fake worker       | `no`: pdf.js never logged `Setting up fake worker.`                |
| PDF GETs          | `1`                                                                |
| Range             | `0`                                                                |
| Asset GETs        | more than `0` in the `assetsUrl` runs                              |
| WebAssembly       | `used` in the `assetsUrl` run with `'wasm-unsafe-eval'`            |
| Download          | `yes`                                                              |
| Print images      | all page images loaded, for example `3/3`                          |
| Viewer violations | `0`, optional `wasm-eval`, or the worker in the control run        |
| Other violations  | any number, see below                                              |

The script collects violations from `securitypolicyviolation` events and from `report-uri`
reports, which also cover the worker. For this, the server adds `report-uri` and
`'report-sample'` to the policy. They do not change what the policy allows.

The script assigns each violation to the viewer or to the rest of the app. It uses the blocked
URL, the element of a blocked `style` attribute, or the module of the built code that caused
the violation. The build is not minified, so each module has a `//#region` comment.

In the `assetsUrl` runs, pdf.js must log no warning about a missing asset option. WebKit
reports no violation when the policy blocks WebAssembly. The script therefore reads the
WebAssembly column from the warnings of pdf.js.

Violations outside the viewer do not fail the check. Expect one: `script-src` from
`vaadin-development-mode-detector`. Usage statistics run only on `localhost` and `127.0.0.1`.

The policy allows `'unsafe-inline'` in `style-src`, as every Vaadin app needs it today. See
[web-components#8031](https://github.com/vaadin/web-components/issues/8031) and
[platform#9488](https://github.com/vaadin/platform/issues/9488). To find the inline styles
that the viewer and Vaadin add, remove `'unsafe-inline'` from `POLICY` in `check.js` and run
the check. It then reports each blocked `style` attribute and `<style>` element.

To check the app by hand in a browser, for example Safari, serve it until stopped:

```sh
node packages/pdf-viewer/test/build-check/check.js --serve
```

## Flow application, by hand

Check the Flow builds with the `pdf-viewer` app of [vaadin/use-cases](https://github.com/vaadin/use-cases).
Point its `@vaadin/pdf-viewer` dependency to the package under test, for example a pkg.pr.new preview.
Run the commands below in the root folder of that repository.

1. Add a servlet filter that sends the policy of the package README:

   ```java
   @Component
   public class CspFilter extends OncePerRequestFilter {
       @Override
       protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
               FilterChain chain) throws ServletException, IOException {
           response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; "
                   + "worker-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; "
                   + "font-src 'self' data:; connect-src 'self'");
           chain.doFilter(request, response);
       }
   }
   ```

2. Run each of the three modes:
   - **Production build**: `./mvnw -pl pdf-viewer -am clean package -DskipTests`, then
     `java -jar pdf-viewer/target/pdf-viewer-use-cases-*.jar`.
   - **Dev bundle**: set `vaadin.frontend.hotdeploy=false` in `application.properties`, then
     `./mvnw -pl pdf-viewer spring-boot:run`.
   - **Hotdeploy**: set `vaadin.frontend.hotdeploy=true`, then `./mvnw -pl pdf-viewer spring-boot:run`.
3. Open `http://localhost:8080/`, the home view without a viewer. Record its violations from the
   browser console. They are the baseline of Flow.
4. Open `/uc1` in Chrome, Firefox and Safari. Check these items:
   - The document shows.
   - The console has no `Setting up fake worker.` message.
   - The worker list of the developer tools has a worker with `pdf-viewer-worker` in its URL.
   - The network panel has one request for the PDF.
   - The console has no violations beyond the baseline.
5. Open `/uc10`. The document shows, although the server sends it only once.
6. Open `/uc6` and print a label. The print preview shows the label.
7. Record the mode, browser and result of each step in the PR description.
