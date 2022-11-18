import FormService from "../../services/FormService.js";

const form = new FormService();

const recommendFurniture = (req, res) => {
  const formDTO = req.body;
  form
    .recommendFurniture(formDTO)
    .then((furniture) => {
      res.json({
        message: "Furniture was recommended successfully!",
        furniture: furniture,
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

export { recommendFurniture };
