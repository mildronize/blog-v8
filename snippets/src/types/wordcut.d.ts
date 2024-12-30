declare module "wordcut" {
  interface Wordcut {
    init(): void;
    cut(input: string): string;
    cut(input: string, delimiter: string): string;
    resetCustomDict(): void;
    add(word: string): void;
    useCustomDict(dictionaryFilePath: string): void;
    loadCustomDictText(dictionaryText: string): void;
  }

  const wordcut: Wordcut;
  export = wordcut;
}
