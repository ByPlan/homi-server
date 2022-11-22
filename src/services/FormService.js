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
  }
}
