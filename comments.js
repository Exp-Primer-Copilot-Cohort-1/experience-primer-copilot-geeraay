// create web server
// create route to handle comments
// use fs to read and write comments to a file
// use querystring to parse the form data
// use template literals to create html for the comments
// use the url module to parse the querystring
// use the http module to create a web server
// use the fs module to read and write files
// use the querystring module to parse form data
// use the url module to parse the querystring

const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

http
  .createServer((req, res) => {
    const q = url.parse(req.url, true);
    if (q.pathname === "/comments" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("comments.html", (err, data) => {
        if (err) return console.error(err);
        res.end(data);
      });
    } else if (q.pathname === "/comments" && req.method === "POST") {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });
      req.on("end", () => {
        const post = querystring.parse(body);
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.readFile("comments.html", (err, data) => {
          if (err) return console.error(err);
          const comment = `<p>${post.comment}</p>`;
          const html = `${data
            .toString()
            .replace('<div id="comments"></div>', comment)}\n`;
          fs.writeFile("comments.html", html, (err) => {
            if (err) return console.error(err);
          });
          res.end(html);
        });
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("404 Not Found");
    }
  })
  .listen(8080);
console.log("Server running at http://localhost:8080/");
