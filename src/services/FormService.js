import { Op } from "sequelize";
import db from "../db/models/index.js";
import { cosineSim } from "../helpers/CosineSimilarity.js";
import { isEqual } from "../helpers/ArrayManager.js";

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

    const styleOrder = [];
    for (let i = 0; i < recommendedFurniture.length; i++) {
      let j = 0;
      for (const tag in recommendedFurniture[i].style) {
        if (i == 0) {
          styleOrder.push({
            tag: tag,
            ratio: Number(recommendedFurniture[i].style[tag]),
          });
        } else {
          styleOrder[j].ratio += Number(recommendedFurniture[i].style[tag]);
        }
        j++;
      }
    }
    styleOrder
      .sort((a, b) => a.ratio - b.ratio)
      .reverse()
      .splice(3, 4);

    let styleSum = 0;
    styleOrder.forEach((element) => {
      styleSum += element.ratio;
    });
    for (const style of styleOrder) {
      style.ratio = Math.round((style.ratio / styleSum) * 1000) / 10;
    }

    console.log(styleOrder);

    const keyStyle = [];
    let message = "";
    keyStyle.push(styleOrder[0].tag, styleOrder[1].tag);

    if (isEqual(keyStyle, ["모던", "내추럴"])) {
      message =
        "모노톤 배경에 우드, 식물로 포인트를 준 스타일링을 선호하시군요. 플랜테리어도 좋은 선택지가 될 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["모던", "미니멀"])) {
      message =
        "깔끔하고 직선적인 모던과 미니멀 조합입니다. 공간이 넓어 보이는 효과가 있으며, 몇 개의 소품을 잘 활용해 포인트를 줄 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["모던", "북유럽"])) {
      message =
        "화이트 배경에 따뜻한 느낌의 오브제를 활용한 연출을 선호하시군요. 패브릭 소재와 액자, 조명으로 다양한 분위기를 낼 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["모던", "빈티지"])) {
      message =
        "개성이 뚜렷한 모던 빈티지 스타일입니다. 자연스러운 컬러감과 깔끔한 모던 가구를 활용해 따스한 분위기를 연출할 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["내추럴", "미니멀"])) {
      message =
        "무채색 배경에 브라운톤이 가미된 스타일입니다. 원목, 라탄 등 자연소재를 포인트 가구로 활용해 산뜻한 분위기를 연출할 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["내추럴", "북유럽"])) {
      message =
        "전반적으로 따뜻한 색감과 우드톤의 분위기 연출을 선호하는 타입이시네요. 패브릭 소재와 플랜테리어를 활용한다면 더 포근한 느낌을 줄 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["내추럴", "빈티지"])) {
      message =
        "짙은 원목 계열 가구를 활용해 레트로한 연출을 선호하시군요. 클래식한 소품과 레드 컬러를 포인트 색상으로 활용하면 훨씬 세련된 느낌을 줄 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["미니멀", "북유럽"])) {
      message =
        "차분하고 심플한 분위기에 넓은 공간감이 매력적인 조합입니다. 화이트 배경에 블랙의 포인트 색상, 혹은 조형적인 디자인의 오브제를 활용할 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["미니멀", "빈티지"])) {
      message =
        "클래식한 가구를 최소한으로 배치해 세련된 분위기가 돋보이는 연출입니다. 화이트톤 배경에 빈티지한 소품으로 컬러를 채운다면 부드럽고 평온한 느낌을 가져다줍니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    } else if (isEqual(keyStyle, ["북유럽", "빈티지"])) {
      message =
        "차 한잔이 생각나는 따스하면서 포근한 분위기를 선호하시군요. 원목과 패브릭의 조합으로 독특한 색감과 패턴을 연출할 수 있습니다. 아래 추천 가구를 확인하시고 당신만의 공간을 꾸며보세요.";
    }

    return {
      message: message,
      keyword: styleOrder,
      participant: participantRecord,
      furniture: recommendedFurniture,
    };
  }
}
