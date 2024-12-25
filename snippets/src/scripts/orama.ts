import { create, search, insert, insertMultiple } from "@orama/orama";
import { persistToFile, restoreFromFile } from "@orama/plugin-data-persistence/server";

const movieDB = create({
  schema: {
    title: "string",
    director: "string",
    plot: "string",
    year: "number",
    isFavorite: "boolean",
  },
});

const docs = [
  {
    title: "The prestige",
    director: "Christopher Nolan",
    plot: "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
    year: 2006,
    isFavorite: true,
  },
  {
    title: "Big Fish",
    director: "Tim Burton",
    plot: "Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.",
    year: 2004,
    isFavorite: true,
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    director: "Chris Columbus",
    plot: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
    year: 2001,
    isFavorite: false,
  },
  {
    title: "ละครไทย",
    director: "ทดสอบ",
    plot: "ทดสอบ",
    year: 2021,
    isFavorite: false,
  }
];

insertMultiple(movieDB, docs, 10);
const fileType = "dpack"

const filePath = await persistToFile(
  movieDB,
  fileType,
  "./quotes.msp"
);

console.log(`Saved filePath: ${filePath}`);

const db = await restoreFromFile(fileType, filePath);

const searchResult = await search(db, {
  term: "ทดสอบ",
});

console.log(searchResult.hits);