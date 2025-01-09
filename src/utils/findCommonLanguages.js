//getting Judge0 languages as argument
export const findCommonLanguages = (mLanguages, jLanguages) => {
  //create intersection of two languages
  const updatedJLanguages = jLanguages.map((jLanguage) => {
    const jName = jLanguage.name.split(" ")[0].trim().toLowerCase();
    return {
      id: jLanguage.id,
      name: jName,
    };
  });

  // Find matching languages
  const languages = mLanguages
    .map((mLanguage) => {
      const mNames = Array.isArray(mLanguage.aliases)
        ? mLanguage.aliases.map((alias) => alias.toLowerCase())
        : [];

      // Check for matches
      const matchingJLanguage = updatedJLanguages.find((updatedJLanguage) => {
        return mNames.includes(updatedJLanguage.name);
      });

      if (matchingJLanguage) {
        return {
          languageId: matchingJLanguage.id,
          name: matchingJLanguage.name,
          aliases: mLanguage.aliases,
          extensions: mLanguage.extensions,
          id: mLanguage.id,
        };
      }

      return null;
    })
    .filter((language) => language !== null);

  return languages;
};
