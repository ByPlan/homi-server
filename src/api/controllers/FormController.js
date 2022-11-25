import FormService from "../../services/FormService.js";

const form = new FormService();

const createParticipant = (req, res) => {
  const participantDTO = req.body;
  form
    .createParticipant(participantDTO)
    .then((participant) => {
      res.json({
        message: "Participant was joined successfully!",
        participant: participant,
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const readParticipant = (req, res) => {
  const participantId = req.params.participantId;
  form
    .readParticipant(participantId)
    .then((participant) => {
      res.json({
        message: "Participant information",
        participant: participant,
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const deleteParticipant = (req, res) => {
  const participantId = req.params.participantId;
  form
    .deleteParticipant(participantId)
    .then(() => {
      res.json({
        message: "Participant was deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const recommendFurniture = (req, res) => {
  const participantId = req.params.participantId;
  const formDTO = req.body;
  form
    .recommendFurniture(participantId, formDTO)
    .then(({ participant, furniture }) => {
      res.json({
        message: "Furniture was recommended successfully!",
        participant: participant,
        furniture: furniture,
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

export {
  createParticipant,
  readParticipant,
  deleteParticipant,
  recommendFurniture,
};
