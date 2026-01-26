
import { GoogleGenAI } from "@google/genai";
import { Player, Match } from "../types";

// Initialize the Gemini API client with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTacticalAdvice = async (players: Player[], upcomingMatch: Match) => {
  const playersSummary = players.map(p => `${p.nickname} (${p.position}, Gols: ${p.goals}, Assists: ${p.assists}, Nota: ${p.rating})`).join(", ");
  
  const prompt = `Analise meu time de futebol amador e dê dicas táticas para o próximo jogo contra ${upcomingMatch.opponent}. 
  Jogadores disponíveis: ${playersSummary}. 
  Sugira os titulares ideais e uma formação tática. Seja breve e motivacional.`;

  try {
    // Using gemini-3-pro-preview for complex reasoning and tactical analysis
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Accessing .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Erro ao obter conselho tático:", error);
    return "Não foi possível carregar a análise tática no momento.";
  }
};

export const generateMatchReport = async (match: Match, players: Player[]) => {
  const prompt = `Escreva uma crônica esportiva curta e divertida para um jogo de futebol amador. 
  Placar: Nosso Time ${match.scoreHome} x ${match.scoreAway} ${match.opponent}.
  Considere que foi um jogo disputado na raça.`;

  try {
    // Using gemini-3-flash-preview for basic text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Accessing .text property directly as per guidelines
    return response.text;
  } catch (error) {
    return "Erro ao gerar crônica.";
  }
};
