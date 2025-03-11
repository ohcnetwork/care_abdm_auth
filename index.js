require("dotenv").config();
const http = require("http");
const {
  PORT,
  ABDM_AUTH_URL,
  ABDM_CLIENT_ID,
  ABDM_CLIENT_SECRET,
} = require("./config");

let cache = null;
let cacheTimestamp = null;
let cacheExpiry = null;

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/" && req.method === "POST") {
    try {
      if (!cache || Date.now() - cacheTimestamp > cacheExpiry) {
        const response = await fetch(ABDM_AUTH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: ABDM_CLIENT_ID,
            clientSecret: ABDM_CLIENT_SECRET,
          }),
        });

        if (!response.ok) {
          res.statusCode = response.status;

          res.end(JSON.stringify({ error: "Failed to retrieve data" }));
          return;
        }

        const data = await response.json();

        cache = data;
        cacheTimestamp = Date.now();
        cacheExpiry = (data.expiresIn ?? 1200) * 1000;
        console.log("Cache Updated");
      }

      res.statusCode = 200;
      res.end(JSON.stringify(cache));
    } catch (error) {
      console.error("Error calling ABDM Gateway service:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
