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
  const recommendationType = req.query.recommendationType;
  const formDTO = req.body;
  form
    .recommendFurniture(participantId, recommendationType, formDTO)
    .then(({ message, keyword, participant, furniture, totalPrice }) => {
      res.json({
        message: message,
        keyword: keyword,
        participant: participant,
        furniture: furniture,
        totalPrice: totalPrice,
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const addReview = (req, res) => {
  const participantId = req.params.participantId;
  const reviewDTO = req.body;
  form
    .addReview(participantId, reviewDTO)
    .then((participant) => {
      res.json({
        message: "Review was updated successfully!",
        participant: participant,
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
  addReview,
};
