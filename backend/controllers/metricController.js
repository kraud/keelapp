const Word = require('../models/wordModel')


const calculateBasicUserMetrics = async (user) => {
    let userId = user._id;

    // Pipeline que usa facet, es decir, consultas paralelas.
    const metricsPipeline = [
        // ObjectId('64163ace3bd498bd734db75a') <= Admin dude en base de producción
        {
            $match: { user: userId }
        },
        {
            $facet: {
                translationsByLanguage: [
                    { $unwind: "$translations" },
                    {
                        $group: {
                            _id: "$translations.language",
                            count: { $sum: 1 }
                        }
                    }
                ],
                wordsPerPOS: [
                    {
                        $group: {
                            _id: "$partOfSpeech",
                            count: { $sum: 1 }
                        }
                    }
                ],
                wordsPerMonth: [
                    {
                        $group: {
                            _id: {
                                year: {$year: "$createdAt"},
                                month: { $dateToString: { format: "%m",  date: "$createdAt" } },
                                partOfSpeech: "$partOfSpeech"
                            },
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $addFields: {
                            label:{
                                $concat: [{$toString : "$_id.year"},"-", {$toString : "$_id.month"}]
                            }
                        }
                    },
                    {
                        $sort: {
                            _id: 1 /* ascending order */
                        }
                    }
                ],
                totalWords: [
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                translationsByLanguage: 1,
                wordsPerPOS: 1,
                wordsPerMonth: 1,
                totalWords: { $arrayElemAt: ["$totalWords.count", 0] }
            }
        }
    ];
    const metricPipelineResult = await Word.aggregate(metricsPipeline);
    return metricPipelineResult[0]
}


module.exports = {
    calculateBasicUserMetrics
}
