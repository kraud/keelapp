
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

    // ============== ENGLISH: ==============
        // Pronouns:
        // I: 1st person singular (1s)
        // you: 2nd person singular/plural (2s/2pl)
        // he/she/it: 3rd person singular (male-female-neutral) (3s)
        // we: 1nd person plural (1pl)
        // they: 3rd person plural (3pl)
    // Naming convention: category - tense - pronoun - language

    // SIMPLE: --------------
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

    // PROGRESSIVE: --------------
    // Same for every pronoun. Ends in -ing (same as perfect progressive)
    // 'prefix': (Present: to-be present), (Past: to-be past), (Future: 'will be'), (Conditional: 'would be')
    progressivePPFCAllEN = "progressivePPFCAllEN",

    // PERFECT: --------------
    // Same for every pronoun.
    // 'prefix': (Present: have present), (Past: had past), (Future: 'will have'), (Conditional: 'would have')
    perfectPPFCAllEN = "perfectPPFCAllEN",

    // PERFECT PROGRESSIVE: --------------
    // Same for every pronoun.  Ends in -ing (same as progressive)
    // 'prefix': (Present: have been), (Past: had been), (Future: 'will have been'), (Conditional: 'would have been')
    perfectProgressivePPFCAllEN = "perfectProgressivePPFCAllEN",


    // ============== SPANISH: ==============
        // Pronouns:
        // yo: 1st person singular (1s)
        // tú/vos: 2nd person singular (2s)
        // él/ella: 3rd person singular (male-female-neutral) (3s)
        // nosotros/as: 1nd person plural (1pl)
        // vosotros/as || ustedes: 2nd person plural (2pl)
        // ellos/as: 3rd person plural (3pl)

    infinitiveNonFiniteSimpleES = 'infinitiveNonFiniteSimpleES',
    gerundNonFiniteSimpleES = 'gerundNonFiniteSimpleES',
    participleNonFiniteSimpleES = 'participleNonFiniteSimpleES',

    // both compound forms are the same
    infinitiveNonFiniteCompound = 'infinitiveNonFiniteCompound', // "haber"...+
    gerundNonFiniteCompound = 'gerundNonFiniteCompound', // "habiendo"...+

    // Naming convention: mode - type(simple/compound) - time - pronoun - language
    // INDICATIVE: --------------
    indicativePresent1sES = "indicativePresent1sES",
    indicativePresent2sES = "indicativePresent2sES",
    indicativePresent3sES = "indicativePresent3sES",
    indicativePresent1plES = "indicativePresent1plES",
    indicativePresent2plES = "indicativePresent2plES",
    indicativePresent3plES = "indicativePresent3plES",

    indicativePerfectPast1sES = "indicativePerfectPast1sES",
    indicativePerfectPast2sES = "indicativePerfectPast2sES",
    indicativePerfectPast3sES = "indicativePerfectPast3sES",
    indicativePerfectPast1plES = "indicativePerfectPast1plES",
    indicativePerfectPast2plES = "indicativePerfectPast2plES",
    indicativePerfectPast3plES = "indicativePerfectPast3plES",

    indicativePerfectSimplePast1sES = "indicativePerfectSimplePast1sES",
    indicativePerfectSimplePast2sES = "indicativePerfectSimplePast2sES",
    indicativePerfectSimplePast3sES = "indicativePerfectSimplePast3sES",
    indicativePerfectSimplePast1plES = "indicativePerfectSimplePast1plES",
    indicativePerfectSimplePast2plES = "indicativePerfectSimplePast2plES",
    indicativePerfectSimplePast3plES = "indicativePerfectSimplePast3plES",

    indicativeFuture1sES = "indicativeFuture1sES",
    indicativeFuture2sES = "indicativeFuture2sES",
    indicativeFuture3sES = "indicativeFuture3sES",
    indicativeFuture1plES = "indicativeFuture1plES",
    indicativeFuture2plES = "indicativeFuture2plES",
    indicativeFuture3plES = "indicativeFuture3plES",

    indicativeConditional1sES = "indicativeConditional1sES",
    indicativeConditional2sES = "indicativeConditional2sES",
    indicativeConditional3sES = "indicativeConditional3sES",
    indicativeConditional1plES = "indicativeConditional1plES",
    indicativeConditional2plES = "indicativeConditional2plES",
    indicativeConditional3plES = "indicativeConditional3plES",

    // SUBJECTIVE: --------------

    // IMPERATIVE: --------------
    imperative1sES = "imperative1sES",
    imperative2sES = "imperative2sES",
    imperative3sES = "imperative3sES",
    imperative1plES = "imperative1plES",
    imperative2plES = "imperative2plES",
    imperative3plES = "imperative3plES",


    // ============== ESTONIAN: ==============
        // Pronouns:
        // Mina (ma): 1st person singular (1s)
        // Sina (Sa): 2nd person singular (2s)
        // Tema (Ta): 3rd person singular (neutral) (3s)
        // Meie (me): 1nd person plural (1pl)
        // Teie  (Te): 2nd person plural (2pl)
        // Nad (nad): 3rd person plural (3pl)

    // KINDEL: --------------
    infinitiveMaEE = 'infinitiveMaEE',
    infinitiveDaEE = 'infinitiveDaEE',

    // present (positive)
    // TODO: missing present (negative: ei+nud variant - same for all pronouns same except 'other'
    kindelPresent1sEE = 'kindelPresent1sEE',
    kindelPresent2sEE = 'kindelPresent2sEE',
    kindelPresent3sEE = 'kindelPresent3sEE',
    kindelPresent1plEE = 'kindelPresent1plEE',
    kindelPresent2plEE = 'kindelPresent2plEE',
    kindelPresent3plEE = 'kindelPresent3plEE',
    // simple past (positive)
    // TODO: missing present (negative: ei+nud variant - same for all pronouns same except 'other'
    kindelSimplePast1sEE = 'kindelSimplePast1sEE',
    kindelSimplePast2sEE = 'kindelSimplePast2sEE',
    kindelSimplePast3sEE = 'kindelSimplePast3sEE',
    kindelSimplePast1plEE = 'kindelSimplePast1plEE',
    kindelSimplePast2plEE = 'kindelSimplePast2plEE',
    kindelSimplePast3plEE = 'kindelSimplePast3plEE',


    // ============== GERMAN: ==============
        // Pronouns:
        // Ich: 1st person singular (1s)
        // Du: 2nd person singular (2s)
        // Er/Sie/ist: 3rd person singular (m/f/n) (3s)
        // Wir: 1nd person plural (1pl)
        // Ihr: 2nd person plural (2pl)
        // Sie: 3rd person plural (3pl)

    infinitiveDE = 'infinitiveDE',

    // INDICATIVE: --------------
    // Present: different for almost all pronouns
    indicativePresent1sDE = 'indicativePresent1sDE',
    indicativePresent2sDE = 'indicativePresent2sDE',
    indicativePresent3sDE = 'indicativePresent3sDE',
    indicativePresent1plDE = 'indicativePresent1plDE',
    indicativePresent2plDE = 'indicativePresent2plDE',
    indicativePresent3plDE = 'indicativePresent3plDE',
    // Imperfect: different for almost all pronouns
    indicativeImperfect1sDE = 'indicativeImperfect1sDE',
    indicativeImperfect2sDE = 'indicativeImperfect2sDE',
    indicativeImperfect3sDE = 'indicativeImperfect3sDE',
    indicativeImperfect1plDE = 'indicativeImperfect1plDE',
    indicativeImperfect2plDE = 'indicativeImperfect2plDE',
    indicativeImperfect3plDE = 'indicativeImperfect3plDE',
    // (present) Perfect: 'habe'-present-conjugated & ge+'stem'+t => same for all pronouns
    indicativePerfect1sDE = 'indicativePerfect1sDE',
    indicativePerfect2sDE = 'indicativePerfect2sDE',
    indicativePerfect3sDE = 'indicativePerfect3sDE',
    indicativePerfect1plDE = 'indicativePerfect1plDE',
    indicativePerfect2plDE = 'indicativePerfect2plDE',
    indicativePerfect3plDE = 'indicativePerfect3plDE',
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
