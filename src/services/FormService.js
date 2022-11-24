import db from "../db/models/index.js";

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
    const participantRecord = await db.Participant.update(
      {
        style: formDTO.style,
        wallpaper: formDTO.wallpaper,
        budget: formDTO.budget,
      },
      { where: { id: participantId } }
    );
    if (!participantRecord) {
      throw new Error("Participant not found!");
    }
    const furnitureList = [];
    for (const furniture of participantRecord.budget) {
      furnitureList.push(furniture);
    }
  }
}
