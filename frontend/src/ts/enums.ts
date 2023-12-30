
export enum NounCases {
    // ENGLISH
    singularEN = "singularEN" ,
    pluralEN = "pluralEN",

    // SPANISH
    genderES = "genderES",
    singularES = "singularES",
    pluralES = "pluralES",

    // GERMAN
    genderDE = "genderDE",
    singularNominativDE = "singularNominativDE",
    pluralNominativDE = "pluralNominativDE",

    singularAkkusativDE = "singularAkkusativDE",
    pluralAkkusativDE = "pluralAkkusativDE",

    singularGenitivDE = "singularGenitivDE",
    pluralGenitivDE = "pluralGenitivDE",

    singularDativDE = "singularDativDE",
    pluralDativDE = "pluralDativDE",

    // ESTONIAN
    singularNimetavEE = "singularNimetavEE",
    pluralNimetavEE = "pluralNimetavEE",

    singularOmastavEE = "singularOmastavEE",
    pluralOmastavEE = "pluralOmastavEE",

    singularOsastavEE = "singularOsastavEE",
    pluralOsastavEE = "pluralOsastavEE",

    shortFormEE = "shortFormEE",
}

export enum AdverbCases {
    // ENGLISH
    adverbEN = "adverbEN",
    comparativeEN = "comparativeEN",
    superlativeEN = "superlativeEN",

    // SPANISH
    adverbES = "adverbES",
    comparativeES = "comparativeES",
    superlativeES = "superlativeES",

    // GERMAN
    gradableDE = "gradableDE",
    adverbDE = "adverbDE",
    comparativeDE = "comparativeDE",
    superlativeDE = "superlativeDE",
}

export enum AdjectiveCases {
    // ENGLISH
    positiveEN = "positiveEN",
    comparativeEN = "comparativeEN",
    superlativeEN = "superlativeEN",

    // SPANISH
    maleSingularES = "maleSingularES",
    malePluralES = "malePluralES",
    femaleSingularES = "femaleSingularES",
    femalePluralES = "femalePluralES",

    neutralSingularES = "neutralSingularES",
    neutralPluralES = "neutralPluralES",

    // GERMAN
    positiveDE = "positiveDE",
    komparativDE = "komparativDE",
    superlativDE = "superlativDE",

    // ESTONIAN
    algvorreEE = "algvorreEE",
    keskvorreEE = "keskvorreEE",
    ulivorreEE = "ulivorreEE",

    // NB! singularNivetav is the same as algvorre
    pluralNimetavEE = "pluralNimetavEE",

    singularOmastavEE = "singularOmastavEE",
    pluralOmastavEE = "pluralOmastavEE",

    singularOsastavEE = "singularOsastavEE",
    pluralOsastavEE = "pluralOsastavEE",
}

export enum Lang {
    ES = "Spanish",
    EN = "English",
    DE = "German",
    EE = "Estonian",
}

export enum GenderDE {
    M = "der", // MALE
    F = "die", // FEMALE
    N = "das" // NEUTRAL
}

export enum PartOfSpeech {
    noun = "Noun",
    pronoun = "Pronoun",
    verb = "Verb",
    adjective = "Adjective",
    adverb = "Adverb",
    preposition = "Preposition",
    conjunction = "Conjunction",
    interjection = "Interjection",
    properNoun = "Proper noun",
    numerals = "Numerals",
}
