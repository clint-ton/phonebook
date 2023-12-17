const express = require("express");
const cors = require("cors");
const morganBody = require("morgan-body");
const Person = require("./models/person");
const app = express();

app.use(express.json());
morganBody(app);
app.use(cors());
app.use(express.static("dist"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

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
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(response.status(204).end())
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const d = new Date();
  const text = d.toTimeString();
  response.send(
    `<p>Phonebook has infor for ${persons.length} people</p><p>${text}</p>`
  );
});

app.post("/api/persons", (request, response, next) => {
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

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((result) => {
      console.log(`Added ${body.name}, number ${body.number} to phonebook`);
      response.status(200).json(newPerson);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, err) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
