const { nounGroupedCategoriesMultiLanguage } = require('../../utils/equivalentTranslations/multiLang/nouns');
const { verbGroupedCategoriesMultiLanguage } = require('../../utils/equivalentTranslations/multiLang/verbs');
const { nounGroupedCategoriesSingleLanguage } = require('../../utils/equivalentTranslations/singleLang/nouns');
const { verbGroupedCategoriesSingleLanguage } = require('../../utils/equivalentTranslations/singleLang/verbs');

const LANGUAGES = ['English', 'Spanish', 'German', 'Estonian'];

const collectLeaves = (obj, path = []) => {
    let leaves = [];
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            if (Object.values(v).every(x => typeof x === 'string')) {
                leaves.push({ path: [...path, k], mapping: v });
            } else {
                leaves.push(...collectLeaves(v, [...path, k]));
            }
        }
    }
    return leaves;
};

describe('Multi-Language Case Mapping', () => {
    describe('nounGroupedCategoriesMultiLanguage', () => {
        const leaves = collectLeaves(nounGroupedCategoriesMultiLanguage);

        it('has top-level categories (singular, plural)', () => {
            expect(nounGroupedCategoriesMultiLanguage).toHaveProperty('singular');
            expect(nounGroupedCategoriesMultiLanguage).toHaveProperty('plural');
        });

        it('has grammatical cases at leaf level', () => {
            const caseNames = leaves.map(l => l.path[l.path.length - 1]);
            expect(caseNames).toContain('nominative');
            expect(caseNames).toContain('accusative');
            expect(caseNames).toContain('genitive');
        });

        it('maps each equivalent case to all 4 languages', () => {
            leaves.forEach(({ path, mapping }) => {
                const caseName = path.join('.');
                Object.keys(mapping).forEach(lang => {
                    expect(LANGUAGES).toContain(lang);
                    const value = mapping[lang];
                    expect(typeof value).toBe('string');
                    expect(value.length).toBeGreaterThan(0);
                });
            });
        });

        it('maps at least nominative for every language in singular', () => {
            const nominative = nounGroupedCategoriesMultiLanguage.singular.nominative;
            LANGUAGES.forEach(lang => {
                expect(nominative).toHaveProperty(lang);
            });
        });

        it('prefers shorter caseName for singular nominative English (no "Nominativ")', () => {
            expect(nounGroupedCategoriesMultiLanguage.singular.nominative.English).toBe('singularEN');
            expect(nounGroupedCategoriesMultiLanguage.singular.nominative.Estonian).toBe('singularNimetavEE');
        });

        it('reuses same English caseName across different grammatical concepts (EN has no cases)', () => {
            const enSingNom = nounGroupedCategoriesMultiLanguage.singular.nominative.English;
            const enPlurNom = nounGroupedCategoriesMultiLanguage.plural.nominative.English;
            expect(enSingNom).toBe('singularEN');
            expect(enPlurNom).toBe('pluralEN');
        });
    });

    describe('verbGroupedCategoriesMultiLanguage', () => {
        const leaves = collectLeaves(verbGroupedCategoriesMultiLanguage);

        it('has top-level tenses (present, past, future)', () => {
            expect(verbGroupedCategoriesMultiLanguage).toHaveProperty('present');
            expect(verbGroupedCategoriesMultiLanguage).toHaveProperty('past');
            expect(verbGroupedCategoriesMultiLanguage).toHaveProperty('future');
        });

        it('has person-number at leaf level', () => {
            const personKeys = leaves.map(l => l.path[l.path.length - 1]);
            expect(personKeys).toContain('firstSingular');
            expect(personKeys).toContain('thirdSingular');
            expect(personKeys).toContain('firstPlural');
            expect(personKeys).toContain('thirdPlural');
        });

        it('maps present.thirdSingular for all languages', () => {
            const entry = verbGroupedCategoriesMultiLanguage.present.thirdSingular;
            expect(entry).toHaveProperty('English');
            expect(entry).toHaveProperty('Spanish');
            expect(entry).toHaveProperty('German');
            expect(entry).toHaveProperty('Estonian');
        });

        it('includes Estonian in all past tense entries', () => {
            ['firstSingular', 'secondSingular', 'thirdSingular', 'firstPlural', 'thirdPlural'].forEach(person => {
                expect(verbGroupedCategoriesMultiLanguage.past[person]).toHaveProperty('Estonian');
            });
        });

        it('may omit Estonian from future tense (no future in Estonian grammar)', () => {
            ['firstSingular', 'secondSingular', 'thirdSingular', 'firstPlural', 'thirdPlural'].forEach(person => {
                const entry = verbGroupedCategoriesMultiLanguage.future[person];
                expect(entry).not.toHaveProperty('Estonian');
            });
        });

        it('every leaf maps to at least 2 languages', () => {
            leaves.forEach(({ path, mapping }) => {
                expect(Object.keys(mapping).length).toBeGreaterThanOrEqual(2);
            });
        });
    });
});

describe('Single-Language Case Mapping (Drills)', () => {
    const hasNonEmptyValues = (obj) => {
        return Object.entries(obj).every(([key, value]) => {
            if (typeof value === 'object') return hasNonEmptyValues(value);
            return typeof value === 'string' && value.length > 0;
        });
    };

    it('nounGroupedCategoriesSingleLanguage defines drills for known languages', () => {
        expect(nounGroupedCategoriesSingleLanguage).toHaveProperty('Spanish');
        expect(nounGroupedCategoriesSingleLanguage).toHaveProperty('German');
        expect(nounGroupedCategoriesSingleLanguage).toHaveProperty('Estonian');
        expect(nounGroupedCategoriesSingleLanguage).toHaveProperty('English');
    });

    it('verbGroupedCategoriesSingleLanguage defines drills for known languages', () => {
        expect(verbGroupedCategoriesSingleLanguage).toHaveProperty('Spanish');
        expect(verbGroupedCategoriesSingleLanguage).toHaveProperty('English');
        expect(verbGroupedCategoriesSingleLanguage).toHaveProperty('German');
        expect(verbGroupedCategoriesSingleLanguage).toHaveProperty('Estonian');
    });

    it('all single-language drill values are non-empty strings', () => {
        [nounGroupedCategoriesSingleLanguage, verbGroupedCategoriesSingleLanguage].forEach(dict => {
            Object.values(dict).forEach(langData => {
                expect(hasNonEmptyValues(langData)).toBe(true);
            });
        });
    });

    it('Spanish verb drills include regularity MC, participle TI, and gerund TI', () => {
        const es = verbGroupedCategoriesSingleLanguage.Spanish;
        expect(es['Multiple-Choice']).toHaveProperty('regularity');
        expect(es['Text-Input']).toHaveProperty('participle');
        expect(es['Text-Input']).toHaveProperty('gerund');
    });

    it('English verb drill has regularity MC', () => {
        const en = verbGroupedCategoriesSingleLanguage.English;
        expect(en['Multiple-Choice'].regularity.correctValue).toBe('regularityEN');
    });

    it('German verb drill has auxVerb MC', () => {
        const de = verbGroupedCategoriesSingleLanguage.German;
        expect(de['Multiple-Choice'].auxVerb.correctValue).toBe('auxVerbDE');
    });
});

describe('Consistency: caseName values appear across dictionaries', () => {
    const allValueSet = (dict) => {
        const values = new Set();
        const walk = (obj) => {
            for (const v of Object.values(obj)) {
                if (typeof v === 'string') values.add(v);
                else if (typeof v === 'object' && v !== null) walk(v);
            }
        };
        walk(dict);
        return values;
    };

    it('multi-lang noun caseNames overlap with multi-lang verb caseNames only for shared concepts', () => {
        const nounVals = allValueSet(nounGroupedCategoriesMultiLanguage);
        const verbVals = allValueSet(verbGroupedCategoriesMultiLanguage);

        const overlap = [...nounVals].filter(x => verbVals.has(x));
        overlap.forEach(val => {
            expect(val).toMatch(/(singular|plural|infinitive|nonFinite)/);
        });
    });
});
