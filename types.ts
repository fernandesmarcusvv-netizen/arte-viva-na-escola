
// FIX: Import React to use the React.ReactNode type.
import React from 'react';

export enum Module {
  Instrumento = 'FAÇA SEU INSTRUMENTO',
  Pintura = 'PINTE O MUNDO',
}

export type AgeRange = '6-8' | '9-11' | '12-16';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: React.ReactNode;
  actions?: React.ReactNode;
}

// New types for Instrumento module
export interface InstructionStep {
  text: string;
  imageKey: string;
}

export interface Instrument {
    name: string;
    description: string;
}
