import {
  createParticipant,
  readParticipant,
  deleteParticipant,
  recommendFurniture,
  addContact,
} from "../controllers/FormController.js";

export default (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/form", createParticipant);

  app.get("/form/:participantId", readParticipant);

  app.delete("/form/:participantId", deleteParticipant);

  app.put("/form/:participantId", recommendFurniture);

  app.put("/form/:participantId/contact", addContact);
};
