export default {
  '*.{js,jsx,ts,tsx}': (filenames) =>
    filenames
      .filter((filename) => !filename.includes('node_modules'))
      .map((filename) => [
        `eslint --fix "${filename}"`,
        `prettier --write "${filename}"`,
      ])
      .flat(),
  '*.{json,md,yml,yaml}': (filenames) =>
    filenames
      .filter((filename) => !filename.includes('node_modules'))
      .map((filename) => `prettier --write "${filename}"`),
};
