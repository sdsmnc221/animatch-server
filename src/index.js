import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import initializeDb from "./db";
import middleware from "./middleware";
import api from "./api";
import config from "./config.json";

import { read as readFile, write as writeFile } from "./lib/util";

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
);

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);

// connect to db
initializeDb(db => {
  // internal middleware
  app.use(middleware({ config, db }));

  // api router
  app.use("/api", api({ config, db }));

  const FILE_NAME = "./sessions.json";

  app.get("/save", function(req, res) {
    const q = req.query;
    const session = {
      mode: q.mode || null,
      username: q.username || null,
      country: q.country || null,
      timer: q.timer || null,
      endGameStatus: q.endGameStatus || null,
      timeCreated: q.timeCreated || null,
      timeElapsed: q.timeElapsed || null,
      favImage: q.favImage || null
    };

    readFile(FILE_NAME, function(err, data) {
      if (err) {
        res.status(404).send(err);
      } else {
        updateFile(session, data, res);
      }
      return;
    });

    function updateFile(newSession, data, res) {
      const allSessions = JSON.parse(data);
      const mode = newSession.mode || "Trash";

      allSessions[mode].sessions.push(newSession);

      writeFile(FILE_NAME, JSON.stringify(allSessions), function(err) {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send({
            status: "Session saved",
            newSession,
            allSessions
          });
        }
      });
    }
  });

  app.get("/fetch", function(req, res) {
    readFile(FILE_NAME, function(err, data) {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send({
          status: "History fetched",
          allSessions: JSON.parse(data)
        });
      }
      return;
    });
  });

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
