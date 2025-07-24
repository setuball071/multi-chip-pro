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
  sim1Name: z.string().describe('The internal name of the first SIM card.'),
  sim2Name: z.string().describe('The internal name of the second SIM card.'),
  numMessages: z.number().describe('The number of messages to exchange between the SIM cards.'),
});
export type SimulateWarmUpInput = z.infer<typeof SimulateWarmUpInputSchema>;

const SimulateWarmUpOutputSchema = z.object({
  conversationLog: z.array(z.string()).describe('A log of the simulated conversation.'),
});
export type SimulateWarmUpOutput = z.infer<typeof SimulateWarmUpOutputSchema>;

export async function simulateWarmUp(input: SimulateWarmUpInput): Promise<SimulateWarmUpOutput> {
  return simulateWarmUpFlow(input);
}

const warmUpPrompt = ai.definePrompt({
  name: 'warmUpPrompt',
  input: {schema: SimulateWarmUpInputSchema},
  output: {schema: SimulateWarmUpOutputSchema},
  prompt: `You are simulating a conversation between two SIM cards, named {{sim1Name}} and {{sim2Name}}, to warm them up for use.  The goal is to simulate natural conversation.

Simulate {{numMessages}} messages between the two SIM cards. Alternate turns between the two SIMs.  Each turn, add a line to the conversation log with the speaker's name followed by a colon and then the message.`,
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
