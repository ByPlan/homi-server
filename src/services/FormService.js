import { Op } from "sequelize";
import db from "../db/models/index.js";
import { cosineSim } from "../helpers/CosineSimilarity.js";

export default class FormService {
  async createParticipant(participantDTO) {
    const participantRecord = await db.Participant.create({
      age: participantDTO.age,
      job: participantDTO.job,
      residenceType: participantDTO.residenceType,
    });
    return participantRecord;
  }

  async readParticipant(participantId) {
    const participantRecord = await db.Participant.findByPk(participantId);
    if (!participantRecord) {
      throw new Error("Participant not found!");
    }
    return participantRecord;
  }

  async deleteParticipant(participantId) {
    await db.Participant.destroy({
      where: {
        id: participantId,
      },
    });
    return;
  }

  async recommendFurniture(participantId, formDTO) {
    const budget = {};
    for (const furniture of formDTO.budget) {
      budget[furniture.type] = furniture.price;
    }
    await db.Participant.update(
      {
        style: formDTO.style,
        wallpaper: formDTO.wallpaper,
        budget: budget,
      },
      { where: { id: participantId } }
    );
    const participantRecord = await db.Participant.findByPk(participantId);
    if (!participantRecord) {
      throw new Error("Participant not found!");
    }

    const styleResult = [];
    for (const key in participantRecord.style) {
      styleResult.push(Number(participantRecord.style[key]));
    }
    console.log("-------------------- User style result --------------------");
    console.log(styleResult);
    console.log("-----------------------------------------------------------");

    const recommendedFurniture = [];
    for (const key in participantRecord.budget) {
      const furnitureList = await db.Furniture.findAll({
        where: {
          type: key,
          price: {
            [Op.between]: [
              Number(
                participantRecord.budget[key]
                  .split("-")[0]
                  .replace(",", "")
                  .replace("원", "")
              ),
              Number(
                participantRecord.budget[key]
                  .split("-")[1]
                  .replace(",", "")
                  .replace("원", "")
              ),
            ],
          },
        },
      });

      const simList = {};
      for (const furniture of furnitureList) {
        const furnitureSim = Object.values(furniture.style).map((style) => {
          return Number(style);
        });
        simList[furniture.id] = cosineSim(styleResult, furnitureSim);
      }
      console.log(
        `-------------------- ${key}'s similarity list --------------------`
      );
      console.log(simList);
      console.log(
        "-----------------------------------------------------------"
      );

      let maxSim = 0;
      let maxSimId = 0;
      for (const sim in simList) {
        if (maxSim <= simList[sim]) {
          maxSim = simList[sim];
          maxSimId = sim;
        }
      }

      await db.Furniture.findByPk(maxSimId).then((furniture) => {
        recommendedFurniture.push(furniture);
      });
    }

    return { participant: participantRecord, furniture: recommendedFurniture };
  }
}
