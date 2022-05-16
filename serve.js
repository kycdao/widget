const { readFileSync, readdirSync, lstatSync } = require("fs");
const http = require("http");
const path = require("path");
const mime = require("mime-types");

const livereload = require("livereload");

const lrServer = livereload.createServer();

let targetDir = process.cwd();

const maybeChdir = process.argv.filter((arg) => arg.includes("--chdir="));
if (maybeChdir.length > 1) {
  throw new Error("huh. too many chdir");
} else if (maybeChdir.length === 1) {
    targetDir = maybeChdir[0].split('--chdir=')[1]
}

lrServer.watch(targetDir);

const server = http.createServer(async (request, response) => {
  const renderDir = (baseDir, relPath) => {
    console.log(baseDir, relPath);

    const files = readdirSync(path.join(baseDir, relPath)).map((f) => ({
      name: f,
      path: path.join(relPath, f),
    }));

    response.end(
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body> ${files
        .map(
          (f) =>
            `<a href="${f.path}">${f.name}</a> ${
              lstatSync(path.join(baseDir, f.path)).isDirectory()
                ? ""
                : `[<a href="${f.path}?.action=show">show</a>]`
            }`
        )
        .join("<br />")} </body></html>`
    );
    console.log(`ok index (${files.length} files)`);
  };

  const url = new URL(request.url, `http://${request.headers["host"]}`);
  const relativePath = decodeURIComponent(url.pathname);
  const action = url.searchParams.get(".action");

  const filePath = path.join(targetDir, relativePath);

  try {
    if (lstatSync(filePath).isDirectory()) {
      return renderDir(targetDir, relativePath);
    }

    let r = readFileSync(filePath);

    const fileDetails = path.parse(filePath);
    const contentType =
      action === "show" ? "text/plain" : mime.contentType(fileDetails.ext);

    const headers = {};

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    if (filePath.endsWith(".html")) {
      const lrScript = `
      <script>
        document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>')
      </script>`;
      r = Buffer.from(r.toString().replace("</body>", `${lrScript}</body>`));
    }

    headers["Content-Length"] = String(r.byteLength);

    response.writeHead(200, headers);

    await response.end(r);
    console.log(`ok ${relativePath}`);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log(`No such file: ${e.path}`);
    }
    try {
      let r = readFileSync("index.html");
      await response.end(r);
    } catch (e) {
      response.end();
    }
  }
});

server.listen(5000, () => {
  console.log("Running at http://localhost:5000");
});
