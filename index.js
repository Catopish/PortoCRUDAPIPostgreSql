import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.post("/search", async (req, res) => {
  const query = req.body.q;
  let result = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`,
  );
  result = result.data;
  // res.send(result);
  console.log(result);
  res.render("search", { result });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`listening to Port ${port}!`);
});
