'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating a SIM card warm-up conversation.
 *
 * simulateWarmUp - A function that simulates a warm-up conversation between two SIM cards.
 * SimulateWarmUpInput - The input type for the simulateWarmUp function.
 * SimulateWarmUpOutput - The return type for the simulateWarmUp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateWarmUpInputSchema = z.object({
  sim1Name: z.string().describe('O nome interno do primeiro cartão SIM.'),
  sim2Name: z.string().describe('O nome interno do segundo cartão SIM.'),
  numMessages: z.number().describe('O número de mensagens a serem trocadas entre os cartões SIM.'),
});
export type SimulateWarmUpInput = z.infer<typeof SimulateWarmUpInputSchema>;

const SimulateWarmUpOutputSchema = z.object({
  conversationLog: z.array(z.string()).describe('Um registro da conversa simulada.'),
});
export type SimulateWarmUpOutput = z.infer<typeof SimulateWarmUpOutputSchema>;

export async function simulateWarmUp(input: SimulateWarmUpInput): Promise<SimulateWarmUpOutput> {
  return simulateWarmUpFlow(input);
}

const warmUpPrompt = ai.definePrompt({
  name: 'warmUpPrompt',
  input: {schema: SimulateWarmUpInputSchema},
  output: {schema: SimulateWarmUpOutputSchema},
  prompt: `Você está simulando uma conversa entre dois cartões SIM, chamados {{sim1Name}} e {{sim2Name}}, para aquecê-los para uso. O objetivo é simular uma conversa natural.

Simule {{numMessages}} mensagens entre os dois cartões SIM. Alterne os turnos entre os dois SIMs. A cada turno, adicione uma linha ao registro da conversa com o nome do falante seguido por dois pontos e depois a mensagem.`,
});

const simulateWarmUpFlow = ai.defineFlow(
  {
    name: 'simulateWarmUpFlow',
    inputSchema: SimulateWarmUpInputSchema,
    outputSchema: SimulateWarmUpOutputSchema,
  },
  async input => {
    const {output} = await warmUpPrompt(input);
    return output!;
  }
);
