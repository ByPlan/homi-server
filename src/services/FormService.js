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
    await db.Participant.update(
      {
        style: formDTO.style,
        wallpaper: formDTO.wallpaper,
        budget: formDTO.budget,
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
    console.log(styleResult);
    const budgetRange = {};
    for (const key in participantRecord.budget) {
      budgetRange[key + "0"] = Number(
        participantRecord.budget[key]
          .split("-")[0]
          .replace(",", "")
          .replace("원", "")
      );
      budgetRange[key + "1"] = Number(
        participantRecord.budget[key]
          .split("-")[1]
          .replace(",", "")
          .replace("원", "")
      );
    }

    const recommendedFurniture = [];
    for (const key in participantRecord.budget) {
      const furnitureList = await db.Furniture.findAll({
        where: {
          type: key,
          price: {
            [Op.between]: [budgetRange[key + "0"], budgetRange[key + "1"]],
          },
        },
      });

      const simList = {};
      for (const furniture of furnitureList) {
        const furnitureSim = Object.values(furniture.style).map((style) => {
          return Number(style);
        });

        simList[furniture.id] = cosineSim(styleResult, furnitureSim);
        console.log(simList);
      }

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
