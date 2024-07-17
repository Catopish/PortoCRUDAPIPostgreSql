import express from "express";
import pg from "pg";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const db = new pg.Client({
  user: "al",
  host: "localhost",
  database: "movieRate",
  password: "123",
  port: 5432,
});
db.connect();

async function tvApi(query) {
  const result = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`,
  );
  return result;
}
async function checkDatabase() {
  const result = await db.query(
    "SELECT movie.id AS m_id, title,img,summary,body,comment.id AS c_id FROM movie JOIN comment ON movie.id=comment.movie_id",
  );
  let movieRating = [];
  for (const item of result.rows) {
    movieRating.push({
      id: item.m_id,
      title: item.title,
      img: item.img,
      summary: item.summary,
      comment_id: item.c_id,
      comment_body: item.body,
    });
  }
  return movieRating;
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

app.get("/review", async (req, res) => {
  const result = await checkDatabase();
  // res.send(result);
  res.render("reviewed", { result, query: null });
});

app.post("/review/newpost", async (req, res) => {
  const movieTitle = req.body.movieTitle;
  const movieSummary = req.body.movieSummary;
  const movieImg = req.body.imgSrc;
  const movieComment = req.body.comment;
  const movieId = uuidv4();
  await db.query(
    "INSERT INTO movie (id,title,img,summary) VALUES ($1,$2,$3,$4)",
    [movieId, movieTitle, movieImg, movieSummary],
  );
  await db.query("INSERT INTO comment (body,movie_id) VALUES ($1,$2)", [
    movieComment,
    movieId,
  ]);
  res.redirect("/review");
});

app.post("/review/new", (req, res) => {
  const movieTitle = req.body.movieTitle;
  const movieSummary = req.body.movieSummary;
  const movieImg = req.body.imgSrc;
  res.render("newreview", {
    query: movieTitle,
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
