const http = require("http");
const fs = require("fs");
const path = require("path");

/*
If the correct route is not entered the get method is returned
*/
const PORT = process.env.PORT || 3005;
const dataPath = path.resolve(__dirname, "./database.json");

const server = http.createServer(async (req, res) => {
  switch (req.method) {
    case "POST":
      if (req.url === "/create") {
        let datas = await getDatas();
        datas = JSON.parse(datas);
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            datas.push(JSON.parse(body));
            writeData(datas);
            sendData(res, 201);
          } catch (err) {
            sendErr(res, 406, "Improper JSON format");
          }
        });
      }
      break;
    case "PUT":
      if (req.url?.match(/\/edit\/\d+/)) {
        const idNum = +req.url?.split("edit/")[1];
        let datas = await getDatas();
        datas = JSON.parse(datas);
        let index = datas.findIndex((item) => item["id"] === idNum);
        if (index < 0)
          sendErr(res, 400, `There's no data with the id ${idNum}`);
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const bodyParsed = JSON.parse(body);
            datas[index] = { ...datas[index], ...bodyParsed };
            writeData(datas);
            sendData(res, 202);
          } catch (err) {
            sendErr(res, 406, "Improper JSON format");
          }
        });
      }

    case "DELETE":
      if (req.url?.match(/\/delete\/\d+/)) {
        const idNum = +req.url?.split("delete/")[1];
        let datas = await getDatas();
        datas = JSON.parse(datas);
        let index = datas.findIndex((item) => item["id"] === idNum);
        if (index < 0)
          sendErr(res, 400, `There's no data with the id ${idNum}`);
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          datas.splice(index, 1);
          writeData(datas);
          sendData(res, 202);
        });
      }
    default:
      fs.readFile(dataPath, (err, buf) => {
        //If it couldn't read from the file. i.e file not available error function is called
        buf ? sendData(res, 200) : sendErr(res, 404, "Data not available");
      });
      break;
  }
});

const getDatas = async () => {
  try {
    return fs.readFileSync(dataPath, { encoding: "utf8", flag: "r" });
  } catch (error) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
    return fs.readFileSync(dataPath, { encoding: "utf8", flag: "r" });
  }
};
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data));
};
const sendData = async (response, status) => {
  const datas = await getDatas();
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(datas);
};
const sendErr = (response, status, message) => {
  response.writeHead(status, { "Content-Type": "text/html" });
  response.end(`<h2>${message}...</h2>`);
};

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
