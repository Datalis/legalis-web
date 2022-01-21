/*
 * Extra typings definitions
 */

// Allow .json files imports
declare module '*.json';

//declare module 'highlight-words-core';

// SystemJS module definition
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module 'breakpoint-helper' {
  export default function bph(config: any): void;
}
