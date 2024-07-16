import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
async function tvApi(query) {
  const result = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`,
  );
  return result;
}

app.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    let result = await tvApi(query);
    result = result.data;
    res.render("search", { result, query });
  } catch {
    // let result = await tvApi(query);
    // result = result.data;
    res.send("error");
  }
});

app.post("/review", (req, res) => {
  const movieId = req.body.movieId;
  const movieTitle = req.body.movieTitle;
  const movieSummary = req.body.movieSummary;
  const movieImg = req.body.imgSrc;
  res.render("newreview", {
    query: movieId,
    movieId,
    movieTitle,
    movieSummary,
    movieImg,
  });
});

app.get("/", (req, res) => {
  res.render("index", { query: null });
});

app.listen(port, () => {
  console.log(`listening to Port ${port}!`);
});
