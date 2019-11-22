/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status = 200) {
  return (err, thing) => {
    if (err) return res.status(500).send(err);

    if (thing && typeof thing.toObject === "function") {
      thing = thing.toObject();
    }
    res.status(status).json(thing);
  };
}

/**
 * https://www.dev2qa.com/node-js-read-write-file-examples/
 * Simple read and write file aynschronously
 */
const fs = require("fs");

export function write(filePath, content, cb) {
  const options = { encoding: "utf-8", flag: "w" };

  fs.writeFile(filePath, content, options, cb);
}

export function read(filePath, cb) {
  var options = { encoding: "utf-8", flag: "r" };

  fs.readFile(filePath, options, cb);
}

export function Record({ profile, play, session }) {
  const { configs } = play;
  return {
    username: profile.username,
    country: profile.country,
    timer: configs.timer,
    endGameStatus: session.endGameStatus,
    timeCreated: session.timeCreated,
    timeElapsed: session.timeElapsed,
    moves: session.moves,
    favImage: session.favImage
  };
}
