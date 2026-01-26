
import { GoogleGenAI } from "@google/genai";
import { Player, Match } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTacticalAdvice = async (players: Player[], upcomingMatch: Match) => {
  const playersSummary = players.map(p => `${p.nickname} (${p.position})`).join(", ");
  const prompt = `Dê dicas táticas curtas para o jogo contra ${upcomingMatch.opponent}. Jogadores: ${playersSummary}.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return response.text;
  } catch (error) { return "Não foi possível carregar a análise."; }
};

export const generateMatchReport = async (match: Match) => {
  const prompt = `Escreva uma crônica curta: ${match.scoreHome} x ${match.scoreAway} contra ${match.opponent}.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text;
  } catch (error) { return "Erro ao gerar crônica."; }
};
