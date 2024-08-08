const Word = require('../models/wordModel')

const calculateBasicUserMetrics = async (data) => {
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
                wordsByType: [
                    {
                        $group: {
                            _id: "$partOfSpeech",
                            count: { $sum: 1 }
                        }
                    }
                ],
                wordsByMonth: [
                    {
                        $group: {
                            _id: {
                                year: {$year: "$createdAt"},
                                month: { $dateToString: { format: "%m",  date: "$createdAt" } }
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
                            _id: -1
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
                wordsByType: 1,
                wordsByMonth: 1,
                totalWords: { $arrayElemAt: ["$totalWords.count", 0] }
            }
        }
    ];
    const metricPipelineResult = await Word.aggregate(metricsPipeline);
    console.log("All in one grouped: ", metricPipelineResult[0]);

    return metricPipelineResult
}


module.exports = {
    calculateBasicUserMetrics
}
