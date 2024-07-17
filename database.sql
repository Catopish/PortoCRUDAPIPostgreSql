--for creating table--
CREATE TABLE movie(
id UUID NOT NULL PRIMARY KEY,
title TEXT,
img TEXT,
summary TEXT
);

CREATE TABLE comment(
id SERIAL NOT NULL PRIMARY KEY,
body TEXT,
movie_id UUID references movie(id)
);
