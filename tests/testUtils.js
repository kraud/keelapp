
function getRandomOfArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function generateRandomId() {
    const chars = '0123456789abcdef';
    let randomId = '';
    for (let i = 0; i < 24; i++) {
        randomId += chars[Math.floor(Math.random() * chars.length)];
    }
    return randomId;
}

const exampleWords = [
    {
        "user": "6621c8fa4f7e8286d9a622f8",
        "partOfSpeech": "Verb",
        "translations": [
            {
                "language": "Spanish",
                "cases": [
                    {
                        "word": "regular",
                        "caseName": "regularityES"
                    },
                    {
                        "word": "abrir",
                        "caseName": "infinitiveNonFiniteSimpleES"
                    },
                    {
                        "word": "abriendo",
                        "caseName": "gerundNonFiniteSimpleES"
                    },
                    {
                        "word": "abierto",
                        "caseName": "participleNonFiniteSimpleES"
                    },
                    {
                        "word": "abro",
                        "caseName": "indicativePresent1sES"
                    },
                    {
                        "word": "abres",
                        "caseName": "indicativePresent2sES"
                    },
                    {
                        "word": "abre",
                        "caseName": "indicativePresent3sES"
                    },
                    {
                        "word": "abrimos",
                        "caseName": "indicativePresent1plES"
                    },
                    {
                        "word": "abrís",
                        "caseName": "indicativePresent2plES"
                    },
                    {
                        "word": "abren",
                        "caseName": "indicativePresent3plES"
                    },
                    {
                        "word": "abría",
                        "caseName": "indicativeImperfectPast1sES"
                    },
                    {
                        "word": "abrías",
                        "caseName": "indicativeImperfectPast2sES"
                    },
                    {
                        "word": "abría",
                        "caseName": "indicativeImperfectPast3sES"
                    },
                    {
                        "word": "abríamos",
                        "caseName": "indicativeImperfectPast1plES"
                    },
                    {
                        "word": "abríais",
                        "caseName": "indicativeImperfectPast2plES"
                    },
                    {
                        "word": "abrían",
                        "caseName": "indicativeImperfectPast3plES"
                    },
                    {
                        "word": "abrí",
                        "caseName": "indicativePerfectSimplePast1sES"
                    },
                    {
                        "word": "abriste",
                        "caseName": "indicativePerfectSimplePast2sES"
                    },
                    {
                        "word": "abrió",
                        "caseName": "indicativePerfectSimplePast3sES"
                    },
                    {
                        "word": "abrimos",
                        "caseName": "indicativePerfectSimplePast1plES"
                    },
                    {
                        "word": "abristeis",
                        "caseName": "indicativePerfectSimplePast2plES"
                    },
                    {
                        "word": "abrieron",
                        "caseName": "indicativePerfectSimplePast3plES"
                    },
                    {
                        "word": "abrí",
                        "caseName": "indicativePerfectSimplePast1sES"
                    },
                    {
                        "word": "abriste",
                        "caseName": "indicativePerfectSimplePast2sES"
                    },
                    {
                        "word": "abrió",
                        "caseName": "indicativePerfectSimplePast3sES"
                    },
                    {
                        "word": "abrimos",
                        "caseName": "indicativePerfectSimplePast1plES"
                    },
                    {
                        "word": "abristeis",
                        "caseName": "indicativePerfectSimplePast2plES"
                    },
                    {
                        "word": "abrieron",
                        "caseName": "indicativePerfectSimplePast3plES"
                    },
                    {
                        "word": "abriré",
                        "caseName": "indicativeFuture1sES"
                    },
                    {
                        "word": "abrirás",
                        "caseName": "indicativeFuture2sES"
                    },
                    {
                        "word": "abrirá",
                        "caseName": "indicativeFuture3sES"
                    },
                    {
                        "word": "abriremos",
                        "caseName": "indicativeFuture1plES"
                    },
                    {
                        "word": "abriréis",
                        "caseName": "indicativeFuture2plES"
                    },
                    {
                        "word": "abrirán",
                        "caseName": "indicativeFuture3plES"
                    }
                ]
            },
            {
                "language": "English",
                "cases": [
                    {
                        "word": "regular",
                        "caseName": "regularityEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simplePresent1sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simplePresent2sEN"
                    },
                    {
                        "word": "opens",
                        "caseName": "simplePresent3sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simplePresent1plEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simplePresent3plEN"
                    },
                    {
                        "word": "opened",
                        "caseName": "simplePast1sEN"
                    },
                    {
                        "word": "opened",
                        "caseName": "simplePast2sEN"
                    },
                    {
                        "word": "opened",
                        "caseName": "simplePast3sEN"
                    },
                    {
                        "word": "opened",
                        "caseName": "simplePast1plEN"
                    },
                    {
                        "word": "opened",
                        "caseName": "simplePast3plEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleFuture1sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleFuture2sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleFuture3sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleFuture1plEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleFuture3plEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleConditional1sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleConditional2sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleConditional3sEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleConditional1plEN"
                    },
                    {
                        "word": "open",
                        "caseName": "simpleConditional3plEN"
                    }
                ]
            },
            {
                "language": "German",
                "cases": [
                    {
                        "word": "öffnen",
                        "caseName": "infinitiveDE"
                    },
                    {
                        "word": "haben",
                        "caseName": "auxVerbDE"
                    },
                    {
                        "word": "D",
                        "caseName": "caseTypeDE"
                    },
                    {
                        "word": "öffne",
                        "caseName": "indicativePresent1sDE"
                    },
                    {
                        "word": "öffnest",
                        "caseName": "indicativePresent2sDE"
                    },
                    {
                        "word": "öffnet",
                        "caseName": "indicativePresent3sDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativePresent1plDE"
                    },
                    {
                        "word": "öffnet",
                        "caseName": "indicativePresent2plDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativePresent3plDE"
                    },
                    {
                        "word": "geöffnet",
                        "caseName": "indicativePerfect1sDE"
                    },
                    {
                        "word": "geöffnet",
                        "caseName": "indicativePerfect2sDE"
                    },
                    {
                        "word": "geöffnet",
                        "caseName": "indicativePerfect3sDE"
                    },
                    {
                        "word": "geöffnet",
                        "caseName": "indicativePerfect1plDE"
                    },
                    {
                        "word": "geöffnet",
                        "caseName": "indicativePerfect2plDE"
                    },
                    {
                        "word": "geöffnet",
                        "caseName": "indicativePerfect3plDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativeSimpleFuture1sDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativeSimpleFuture2sDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativeSimpleFuture3sDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativeSimpleFuture1plDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativeSimpleFuture2plDE"
                    },
                    {
                        "word": "öffnen",
                        "caseName": "indicativeSimpleFuture3plDE"
                    },
                    {
                        "word": "öffnete",
                        "caseName": "indicativeSimplePast1sDE"
                    },
                    {
                        "word": "öffnetest",
                        "caseName": "indicativeSimplePast2sDE"
                    },
                    {
                        "word": "öffnete",
                        "caseName": "indicativeSimplePast3sDE"
                    },
                    {
                        "word": "öffneten",
                        "caseName": "indicativeSimplePast1plDE"
                    },
                    {
                        "word": "öffnetet",
                        "caseName": "indicativeSimplePast2plDE"
                    },
                    {
                        "word": "öffneten",
                        "caseName": "indicativeSimplePast3plDE"
                    }
                ]
            }
        ],
        "isCloned": false
    },
    {
        "user": "6621c8fa4f7e8286d9a622f8",
        "partOfSpeech": "Noun",
        "translations": [
            {
                "language": "English",
                "cases": [
                    {
                        "word": "time",
                        "caseName": "singularEN"
                    }
                ]
            },
            {
                "language": "Spanish",
                "cases": [
                    {
                        "word": "tiempo",
                        "caseName": "singularES"
                    },
                    {
                        "word": "el",
                        "caseName": "genderES"
                    }
                ]
            }
        ],
        "isCloned": false
    },
    {
        "user": "6621c8fa4f7e8286d9a622f8",
        "partOfSpeech": "Verb",
        "translations": [
            {
                "language": "English",
                "cases": [
                    {
                        "word": "regular",
                        "caseName": "regularityEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simplePresent1sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simplePresent2sEN"
                    },
                    {
                        "word": "makes",
                        "caseName": "simplePresent3sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simplePresent1plEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simplePresent3plEN"
                    },
                    {
                        "word": "made",
                        "caseName": "simplePast1sEN"
                    },
                    {
                        "word": "made",
                        "caseName": "simplePast2sEN"
                    },
                    {
                        "word": "made",
                        "caseName": "simplePast3sEN"
                    },
                    {
                        "word": "made",
                        "caseName": "simplePast1plEN"
                    },
                    {
                        "word": "made",
                        "caseName": "simplePast3plEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleFuture1sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleFuture2sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleFuture3sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleFuture1plEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleFuture3plEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleConditional1sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleConditional2sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleConditional3sEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleConditional1plEN"
                    },
                    {
                        "word": "make",
                        "caseName": "simpleConditional3plEN"
                    }
                ]
            },
            {
                "language": "Spanish",
                "cases": [
                    {
                        "word": "hacer",
                        "caseName": "infinitiveNonFiniteSimpleES"
                    },
                    {
                        "word": "haciendo",
                        "caseName": "gerundNonFiniteSimpleES"
                    },
                    {
                        "word": "hecho",
                        "caseName": "participleNonFiniteSimpleES"
                    },
                    {
                        "word": "hago",
                        "caseName": "indicativePresent1sES"
                    },
                    {
                        "word": "haces",
                        "caseName": "indicativePresent2sES"
                    },
                    {
                        "word": "hace",
                        "caseName": "indicativePresent3sES"
                    },
                    {
                        "word": "hacemos",
                        "caseName": "indicativePresent1plES"
                    },
                    {
                        "word": "hacéis",
                        "caseName": "indicativePresent2plES"
                    },
                    {
                        "word": "hacen",
                        "caseName": "indicativePresent3plES"
                    },
                    {
                        "word": "hacía",
                        "caseName": "indicativeImperfectPast1sES"
                    },
                    {
                        "word": "hacías",
                        "caseName": "indicativeImperfectPast2sES"
                    },
                    {
                        "word": "hacía",
                        "caseName": "indicativeImperfectPast3sES"
                    },
                    {
                        "word": "hacíamos",
                        "caseName": "indicativeImperfectPast1plES"
                    },
                    {
                        "word": "hacíais",
                        "caseName": "indicativeImperfectPast2plES"
                    },
                    {
                        "word": "hacían",
                        "caseName": "indicativeImperfectPast3plES"
                    },
                    {
                        "word": "hice",
                        "caseName": "indicativePerfectSimplePast1sES"
                    },
                    {
                        "word": "hiciste",
                        "caseName": "indicativePerfectSimplePast2sES"
                    },
                    {
                        "word": "hizo",
                        "caseName": "indicativePerfectSimplePast3sES"
                    },
                    {
                        "word": "hicimos",
                        "caseName": "indicativePerfectSimplePast1plES"
                    },
                    {
                        "word": "hicisteis",
                        "caseName": "indicativePerfectSimplePast2plES"
                    },
                    {
                        "word": "hicieron",
                        "caseName": "indicativePerfectSimplePast3plES"
                    },
                    {
                        "word": "hice",
                        "caseName": "indicativePerfectSimplePast1sES"
                    },
                    {
                        "word": "hiciste",
                        "caseName": "indicativePerfectSimplePast2sES"
                    },
                    {
                        "word": "hizo",
                        "caseName": "indicativePerfectSimplePast3sES"
                    },
                    {
                        "word": "hicimos",
                        "caseName": "indicativePerfectSimplePast1plES"
                    },
                    {
                        "word": "hicisteis",
                        "caseName": "indicativePerfectSimplePast2plES"
                    },
                    {
                        "word": "hicieron",
                        "caseName": "indicativePerfectSimplePast3plES"
                    },
                    {
                        "word": "haré",
                        "caseName": "indicativeFuture1sES"
                    },
                    {
                        "word": "harás",
                        "caseName": "indicativeFuture2sES"
                    },
                    {
                        "word": "hará",
                        "caseName": "indicativeFuture3sES"
                    },
                    {
                        "word": "haremos",
                        "caseName": "indicativeFuture1plES"
                    },
                    {
                        "word": "haréis",
                        "caseName": "indicativeFuture2plES"
                    },
                    {
                        "word": "harán",
                        "caseName": "indicativeFuture3plES"
                    }
                ]
            },
            {
                "language": "German",
                "cases": [
                    {
                        "word": "machen",
                        "caseName": "infinitiveDE"
                    },
                    {
                        "word": "A",
                        "caseName": "caseTypeDE"
                    },
                    {
                        "word": "mache",
                        "caseName": "indicativePresent1sDE"
                    },
                    {
                        "word": "machst",
                        "caseName": "indicativePresent2sDE"
                    },
                    {
                        "word": "macht",
                        "caseName": "indicativePresent3sDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativePresent1plDE"
                    },
                    {
                        "word": "macht",
                        "caseName": "indicativePresent2plDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativePresent3plDE"
                    },
                    {
                        "word": "gemacht",
                        "caseName": "indicativePerfect1sDE"
                    },
                    {
                        "word": "gemacht",
                        "caseName": "indicativePerfect2sDE"
                    },
                    {
                        "word": "gemacht",
                        "caseName": "indicativePerfect3sDE"
                    },
                    {
                        "word": "gemacht",
                        "caseName": "indicativePerfect1plDE"
                    },
                    {
                        "word": "gemacht",
                        "caseName": "indicativePerfect2plDE"
                    },
                    {
                        "word": "gemacht",
                        "caseName": "indicativePerfect3plDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativeSimpleFuture1sDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativeSimpleFuture2sDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativeSimpleFuture3sDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativeSimpleFuture1plDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativeSimpleFuture2plDE"
                    },
                    {
                        "word": "machen",
                        "caseName": "indicativeSimpleFuture3plDE"
                    },
                    {
                        "word": "machte",
                        "caseName": "indicativeSimplePast1sDE"
                    },
                    {
                        "word": "machtest",
                        "caseName": "indicativeSimplePast2sDE"
                    },
                    {
                        "word": "machte",
                        "caseName": "indicativeSimplePast3sDE"
                    },
                    {
                        "word": "machten",
                        "caseName": "indicativeSimplePast1plDE"
                    },
                    {
                        "word": "machtet",
                        "caseName": "indicativeSimplePast2plDE"
                    },
                    {
                        "word": "machten",
                        "caseName": "indicativeSimplePast3plDE"
                    }
                ]
            }
        ],
        "isCloned": false
    }
]

module.exports = {
    generateRandomId, getRandomOfArray, exampleWords
}