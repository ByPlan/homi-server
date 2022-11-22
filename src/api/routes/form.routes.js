import {
  createParticipant,
  recommendFurniture,
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

  app.put("/form/:participantId", recommendFurniture);
};
