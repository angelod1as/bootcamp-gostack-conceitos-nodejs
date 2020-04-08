const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

const checkId = (id, res) => {
  if (repositories.filter(repo => repo.id === id).length <= 0) {
    res.status(400).send({ error: `Repo ID ${id} not found` });
    return false;
  } return true;
}

app.get("/repositories", (req, res) => {
  res.status(200).send(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs = [] } = req.body
  if (title && url) {
    const id = uuid();
    const newRepo = {
      id,
      title,
      url,
      techs,
      likes: 0,
    };
    repositories.push(newRepo);
    res.status(201).send(newRepo);
  } else {
    res.status(400).send({ error: `Invalid title or URL` });
  }
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  let newRepo;

  if(!checkId(id, res)) { return };

  repositories = repositories.map(repo => {
    if (repo.id === id) {
      newRepo = {
        id,
        title: title || repo.title,
        url: url || repo.url,
        techs: techs || repo.techs,
        likes: repo.likes,
      };
      return newRepo
    }
    return repo;
  });

  res.status(200).send(newRepo);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  if(!checkId(id, res)) { return };

  repositories = repositories.filter(repo => repo.id !== id);

  res.status(204).send({ success: `Repo id ${id} has been deleted`});
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;
  let repoLikes = 0;
  if(!checkId(id, res)) { return };

  repositores = repositories.map(repo => {
    if (repo.id === id) {
      repo.likes += 1;
      repoLikes = repo.likes;
    }
    return repo;
  })

  res.status(200).send({ likes: repoLikes });
});

module.exports = app;
