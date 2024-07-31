
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

export enum VerbCases {
    // Naming convention: category - tense - pronoun - language

    // ENGLISH:
        // Pronouns:
        // I: 1st person singular (1s)
        // you: 2nd person singular/plural (2s/2pl)
        // he/she/it: 3rd person singular (male-female-neutral) (3s)
        // we: 1nd person plural (1pl)
        // they: 3rd person plural (3pl)

    // ---------- SIMPLE: --------------
    // Same for every pronoun except 3s m/f/n
    simplePresent1sEN = "simplePresent1sEN",
    simplePresent2sEN = "simplePresent2sEN",
    simplePresent3sEN = "simplePresent3sEN", // ONLY VARIANT
    simplePresent1plEN = "simplePresent1plEN",
    simplePresent3plEN = "simplePresent3plEN",

    // * regular verbs: 'root'+ed && irregular verbs: !== 'root'
    //  * in both cases all past-fields ALWAYS equal (TODO: double check)
    simplePast1sEN = "simplePast1sEN",
    simplePast2sEN = "simplePast2sEN",
    simplePast3sEN = "simplePast3sEN",
    simplePast1plEN = "simplePast1plEN",
    simplePast3plEN = "simplePast3plEN",

    simpleFuture1sEN = "simpleFuture1sEN",
    simpleFuture2sEN = "simpleFuture2sEN",
    simpleFuture3sEN = "simpleFuture3sEN",
    simpleFuture1plEN = "simpleFuture1plEN",
    simpleFuture3plEN = "simpleFuture3plEN",

    simpleConditional1sEN = "simpleConditional1sEN",
    simpleConditional2sEN = "simpleConditional2sEN",
    simpleConditional3sEN = "simpleConditional3sEN",
    simpleConditional1plEN = "simpleConditional1plEN",
    simpleConditional3plEN = "simpleConditional3plEN",

    // ---------- PROGRESSIVE: --------------
    // Same for every pronoun. Ends in -ing (same as perfect progressive)
    // 'prefix': (Present: to-be present), (Past: to-be past), (Future: 'will be'), (Conditional: 'would be')
    progressivePPFCAllEN = "progressivePPFCAllEN",

    // ---------- PERFECT: --------------
    // Same for every pronoun.
    // 'prefix': (Present: have present), (Past: had past), (Future: 'will have'), (Conditional: 'would have')
    perfectPPFCAllEN = "perfectPPFCAllEN",

    // ---------- PERFECT PROGRESSIVE: --------------
    // Same for every pronoun.  Ends in -ing (same as progressive)
    // 'prefix': (Present: have been), (Past: had been), (Future: 'will have been'), (Conditional: 'would have been')
    perfectProgressivePPFCAllEN = "perfectProgressivePPFCAllEN",

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
