const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateID = (request, response, next) => {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Repository ID is invalid!' });
  }

  return next();
}

app.use('/repositories/:id', validateID);

app.get("/repositories", (request, response) => {
   return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = {
    id: repositories[repositoryIndex].id,
    url: url || repositories[repositoryIndex].url,
    title: title || repositories[repositoryIndex].title,
    techs: techs || repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);
});

module.exports = app;
