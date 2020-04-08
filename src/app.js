const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (req, res) => {
  res.status(200).send(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs = [] } = req.body

  const repo = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repo);

  return res.json(repo);
});

app.put("/repositories/:id", (req, res) => {
  const { id }  = req.params;
  const { title, url, techs } = req.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  }

  repositories[repoIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes += 1;

  res.status(200).send({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
