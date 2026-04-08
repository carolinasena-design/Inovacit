export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  latency?: string;
}

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "I've analyzed the trajectory of your previous query. The multidimensional data points suggest a shift toward sustainable energy architectures. Would you like me to render a conceptual framework for the Hyper-Grid project?",
    timestamp: '09:42 AM',
    latency: '14ms'
  }
];
