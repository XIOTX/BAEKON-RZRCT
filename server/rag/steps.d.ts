export function getSpan(id: string): Promise<any>;
export function retrieveNeighborhood(span: any, k?: number): Promise<any[]>;
export function lookupLexicon(span: any): Promise<any[]>;
export function alignSeed(span: any): Promise<any>;
export function assemblePrompt(args: any): any;
export function callLLM(payload: any, opts: any): Promise<string>;
export function validateJSON(raw: string): any;
export function persistRun(out: any): Promise<any>;
