declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window {
    EntryPoint: Record<string, Function>;
  }
}

export {};