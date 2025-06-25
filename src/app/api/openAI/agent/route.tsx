import { ComposioMain } from '@/app/composio/initial';
import {  OpenAI } from 'openai';


const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });

export async function POST(req: Request, res: Response) {
  const { messages } = await req.json(); 

  // System prompt to guide the agent's behavior
  const systemPrompt = {
     role: 'system',
     content:
       'You are a helpful and friendly AI assistant. You are designed to assist users with their questions and provide informative and engaging responses. Keep your answers concise and to the point.',
   };
 const abc = await ComposioMain();
   // Add the system prompt to the beginning of the messages array
   const messagesWithSystemPrompt = [systemPrompt, ...messages];
 
   try {
     const completion = await openai.chat.completions.create({
       model: 'gpt-3.5-turbo',
       messages: messagesWithSystemPrompt,
     });
 

    const message = completion.choices[0].message.content;
    return Response.json( message );
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return Response.json({ message: 'Error communicating with OpenAI' }, { status: 500 });
  }
}
