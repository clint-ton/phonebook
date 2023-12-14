const express = require("express");
const cors = require("cors")
const morganBody = require("morgan-body");

const app = express();

app.use(express.json());
morganBody(app);
app.use(cors())
app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  const d = new Date();
  const text = d.toTimeString();
  response.send(
    `<p>Phonebook has infor for ${persons.length} people</p><p>${text}</p>`
  );
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body) {
    return response.status(400).json({ error: "content missing" });
  }

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number missing" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "Name already in phonebook" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000),
  };

  persons = persons.concat(person);
  response.json(persons);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
