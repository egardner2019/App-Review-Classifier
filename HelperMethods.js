import * as fs from "fs";
import trainingActionableReviews from "./TrainingData/TrainingActionable.js";
import trainingUnactionableReviews from "./TrainingData/TrainingUnactionable.js";

/**
 * Splits the given review into an array of words
 * @param {string} review The review to be split up into words
 * @returns An array of the words in the review sentence
 */
const splitReviewIntoWords = (review) => {
  // Split each review sentence by spaces
  let reviewWords = review.split(" ");

  // For each word in the review, remove any punctuation and change the word to lowercase
  reviewWords.forEach((word, index) => {
    reviewWords[index] = word
      .toLowerCase()
      .replaceAll(".", "")
      .replaceAll(",", "")
      .replaceAll("?", "")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll("!", "")
      .replaceAll(":", "")
      .replaceAll("&", "")
      .replaceAll("-", "")
      .replaceAll("'", "")
      .replaceAll(";", "");
  });

  // Remove any empty strings that occur after removing punctuation
  reviewWords.filter((word) => word.length > 0);

  // Return the array of formatted words in the review
  return reviewWords;
};

/**
 * Iterates through the reviews in the given array and counts the number of occurrences of each unique word in the reviews based on their categorization (actionable/unactionable).
 * @param {{} | {word: {actionable: number, unactionable: number}}} uniqueWordsInTrainingData An object containing an unknown number of objects (one for each unique word). The keys of the subobjects are these words. The subobjects contain the number of occurrences of the word in actionable and unactionable reviews.
 * @param {string[]} reviewArray An array containing the review sentences
 * @param {boolean} isActionable Whether the review array contains reviews that are actionable (true) or unactionable (false)
 * @returns The uniqueWordsInTrainingData object with the actionable/unactionable occurrences updated according to the given reviewArray
 */
const iterateThroughReviews = (
  uniqueWordsInTrainingData,
  reviewArray,
  isActionable
) => {
  // Iterate through the reviews in the array
  reviewArray.forEach((review) => {
    // Split each review sentence into words
    const reviewWords = splitReviewIntoWords(review);

    // Update uniqueWordsInTrainingData for each word in the review
    reviewWords.forEach((word) => {
      // If the word isn't in uniqueWordsInTrainingData, add it and set the initial count
      if (!(word in uniqueWordsInTrainingData))
        uniqueWordsInTrainingData[word] = {
          actionable: isActionable ? 1 : 0,
          unactionable: isActionable ? 0 : 1,
        };
      // If the word is in uniqueWordsInTrainingData, increment the count for that review type
      else
        uniqueWordsInTrainingData[word][
          isActionable ? "actionable" : "unactionable"
        ]++;
    });
  });

  // Return the updated object with the words from the reviews
  return uniqueWordsInTrainingData;
};

/**
 * Calculates the probability that a real review is actionable
 * @param {string} review The review for which the probability should be calculated
 * @param {{word: {probGivenActionable: number, probGivenUnactionable: number}}} probWordsInTraining An object containing an unknown number of objects (one for each unique word). The keys of the subobjects are these words. The subobjects contain the probabilities that word appears in a review given that it is actionable or unactionable.
 * @param {number} probActionable The probability that any review is actionable
 * @param {number} probUnactionable The probability that any review is unactionable
 * @returns The probability that the given review is actionable
 */
const calculateProbActionableOfRealReview = (
  review,
  probWordsInTraining,
  probActionable,
  probUnactionable
) => {
  let probRealReviewsWords = {};

  // Split each real review sentence into words
  const reviewWords = splitReviewIntoWords(review);

  // Iterate through the words in the review
  reviewWords.forEach((word) => {
    // If the word exists in the training data, add that probability to probRealReviewsWords
    if (word in probWordsInTraining)
      probRealReviewsWords[word] = probWordsInTraining[word];
  });

  // Find the product of the probabilities of the word given actionable and unactionable for each word in the real review
  let productProbWordGivenActionable = 1;
  let productProbWordGivenUnactionable = 1;
  Object.keys(probRealReviewsWords).forEach((word) => {
    productProbWordGivenActionable *=
      probRealReviewsWords[word].probGivenActionable;
    productProbWordGivenUnactionable *=
      probRealReviewsWords[word].probGivenUnactionable;
  });

  // Compute the overall probability of the real review being actionable and return that value
  const overallProb =
    (probActionable * productProbWordGivenActionable) /
    (probActionable * productProbWordGivenActionable +
      probUnactionable * productProbWordGivenUnactionable);
  return overallProb;
};
/**
 * Formats the training data to be used in GRU and LSTM
 * @returns An array of the training reviews
 */
const formatBrainTrainingData = () => {
  let formattedTrainingData = [];

  // Convert the review into words so that words are used in training instead of individual characters
  // https://github.com/BrainJS/brain.js/issues/871
  trainingActionableReviews.forEach((review) =>
    formattedTrainingData.push({
      input: splitReviewIntoWords(review),
      output: "actionable",
    })
  );
  trainingUnactionableReviews.forEach((review) =>
    formattedTrainingData.push({
      input: splitReviewIntoWords(review),
      output: "unactionable",
    })
  );

  return formattedTrainingData;
};

/**
 * Train the network and save the trained network to a JSON file
 * @param {*} trainingData The formatted training data
 * @param {*} neuralNetwork The neural network object from Brain.js
 * @param {"LSTM" | "GRU"} neuralNetworkType
 */
const trainNeuralNetwork = (trainingData, neuralNetwork, neuralNetworkType) => {
  // The file to be written
  const filePath = `TrainedNeuralNetworks/${neuralNetworkType}.json`;

  // Train the neural network with the data
  neuralNetwork.train(trainingData, {
    log: true,
    logPeriod: 100, // Log progress after this many iterations
    iterations: 500, // Max number of iterations
  });

  // Convert the trained neural network to JSON
  const neuralNetworkJSON = neuralNetwork.toJSON();

  // Create a stream to write to a JSON file
  const writeStream = fs.createWriteStream(filePath);

  // Write the neural network JSON to the file
  writeStream.write(JSON.stringify(neuralNetworkJSON));

  // Tell the user if the neural network was successfully written
  writeStream.on("finish", () => {
    console.log(`Wrote trained ${neuralNetworkType} to ${filePath}`);
  });
  writeStream.on("error", (error) => {
    console.error(
      `Unable to write trained ${neuralNetworkType} to ${filePath}. Error: ${error.message}`
    );
  });

  writeStream.end();
};

/**
 * Write the results of running the classifier to the files in the Results folder.
 * @param {string[]} correctActionable The reviews that were labeled actionable and really are actionable (true positive)
 * @param {string[]} incorrectActionable The reviews that were labeled unactionable but are really actionable (false negative)
 * @param {string[]} correctUnactionable The reviews that were labeled unactionable and are really unactionable (true negative)
 * @param {string[]} incorrectUnactionable The reviews that were labeled actionable but are really unactionable (false positive)
 * @param {"NaiveBayes" | "LSTM" | "GRU" | "CFC"} classifier The classifier that produced the results
 */
const writeResultsToFile = (
  correctActionable,
  correctUnactionable,
  incorrectActionable,
  incorrectUnactionable,
  classifier
) => {
  // A sub-method to write to the file
  const writeToFile = (data, fileName) => {
    if (data.length > 0) {
      const writeStream = fs.createWriteStream(
        `Results/${classifier}/${fileName}.txt`
      );

      data.forEach((review) => writeStream.write(`${review}\n`));

      writeStream.on("error", (error) => {
        console.error(
          `Unable to write data to Results/${classifier}/${fileName}.txt. Error: ${error.message}`
        );
      });

      writeStream.end();
    } else
      console.log(
        `There is no data to be written to Results/${classifier}/${fileName}.txt`
      );
  };

  // Write the results to the associated files
  writeToFile(correctActionable.concat(incorrectUnactionable), "AllActionable");
  writeToFile(
    correctUnactionable.concat(incorrectActionable),
    "AllUnactionable"
  );
  writeToFile(incorrectActionable, "ActionableLabeledIncorrectly");
  writeToFile(incorrectUnactionable, "UnactionableLabeledIncorrectly");
};

/**
 * Get a previously trained neural network
 * @param {"LSTM" | "GRU"} networkType
 * @returns The JSON of the previously trained network if it exists. Null otherwise.
 */
const getTrainedNetwork = (networkType) => {
  try {
    const data = fs.readFileSync(`TrainedNeuralNetworks/${networkType}.json`);
    console.log(`Using pre-trained ${networkType}...`);
    return JSON.parse(data);
  } catch (err) {
    console.log(`No pre-trained ${networkType} was found. Training now...`);
    // If an error occurs (e.g. if the file doesn't exist), return null
    return null;
  }
};

/**
 * Format a number to be printed to the output (2 decimal places and a % sign)
 * @param {Number} num The number to be formatted
 * @returns The formatted number
 */
const formatNumber = (num) => {
  if (isNaN(num)) {
    return "N/A";
  } else {
    return (num * 100).toFixed(2) + "%";
  }
};

/**
 * Evaluate the classifier's run and print the results to the console
 * @param {"Naive Bayes" | "LSTM" | "GRU" | "Categorizer" | "CFC Classifier"} classifierType The method being evaluated
 * @param {null | "app" | "gui" | "contents" | "pricing" | "featureFunctionality" | "improvement" | "updatesVersions" | "resources" | "security" | "model" | "company"} cfcCategory The category being evaluated
 * @param {string[]} truePositive The true positive reviews (actual: in category/actionable, label: in category/actionable)
 * @param {string[]} falseNegative The false negative reviews (actual: in category/actionable, label: not in category/unactionable)
 * @param {string[]} trueNegative The true negative reviews (actual: not in category/unactionable, label: not in category/unactionable)
 * @param {string[]} falsePositive The false positive reviews (actual: not in category/unactionable, label: in category/actionable)
 */
const printEvaluationMetrics = (
  classifierType,
  cfcCategory,
  truePositive,
  falseNegative,
  trueNegative,
  falsePositive
) => {
  const truePosCount = truePositive.length;
  const falseNegCount = falseNegative.length;
  const trueNegCount = trueNegative.length;
  const falsePosCount = falsePositive.length;

  const accuracy =
    (truePosCount + trueNegCount) /
    (truePosCount + trueNegCount + falsePosCount + falseNegCount);
  const precision = truePosCount / (truePosCount + falsePosCount);
  const recall = truePosCount / (truePosCount + falseNegCount);
  const fScore = (2 * (precision * recall)) / (precision + recall);

  // Print the results to the console
  console.log(
    `\n------------ Results of ${classifierType} Method ${
      cfcCategory ? `(${getNiceCategoryName(cfcCategory)}) ` : ""
    }------------`
  );
  console.log("Accuracy:", formatNumber(accuracy));
  console.log("Precision:", formatNumber(precision));
  console.log("Recall:", formatNumber(recall));
  console.log("F-Score:", formatNumber(fScore), "\n");

  if (cfcCategory) {
    return {
      category: cfcCategory,
      accuracy: accuracy,
      precision: precision,
      recall: recall,
      fScore: fScore,
    };
  } else {
    return {
      classifierName: classifierType,
      accuracy: accuracy,
      precision: precision,
      recall: recall,
      fScore: fScore,
    };
  }
};

/**
 * Print the average metrics across classifiers/categories
 * @param {Array} allEvalMetrics An array containing the evaluation metrics for each classifier/category
 * @param {boolean} isClassifiers Whether this is evaluating the classifiers (true) or the categorizer (false)
 */
const printAverageMetrics = (allEvalMetrics, isClassifiers) => {
  ["accuracy", "precision", "recall", "fScore"].forEach((metricName) => {
    let availableMetrics = allEvalMetrics.length;
    console.log(
      `Average ${metricName === "fScore" ? "F-score" : metricName} across ${
        isClassifiers ? "classifiers" : "categories"
      }:`,
      formatNumber(
        allEvalMetrics
          .map((thisMetric) => thisMetric[metricName]) // Get an array of the metric value for each classifier/category
          // Get the average of those metric values
          .reduce((a, b) => {
            if (isNaN(b)) {
              availableMetrics--;
              return a;
            } else {
              return a + b;
            }
          }) / availableMetrics
      )
    );
  });
};

/**
 * Write the results from the CFC classifier to ReviewsByCategories.txt
 * @param {string[]} allCategories An array containing all of the possible categories (e.g. app, company, gui)
 * @param {object} categorizedResults An object containing all of the reviews categorized into arrays
 */
const writeReviewsByCategories = (allCategories, categorizedResults) => {
  const writeStream = fs.createWriteStream(
    "Results/Categorizer/ReviewsByCategories.txt"
  );

  allCategories.forEach((category) => {
    if (categorizedResults[category].length === 0)
      writeStream.write(
        `No reviews were categorized as ${getNiceCategoryName(category)}!\n\n`
      );
    else {
      writeStream.write(
        `${
          categorizedResults[category].length
        } reviews were categorized as ${getNiceCategoryName(category)}...\n`
      );
      categorizedResults[category].forEach((result) =>
        writeStream.write(" • " + result + "\n")
      );
      writeStream.write("\n");
    }
  });

  writeStream.on("error", (error) => {
    console.error(
      `Unable to write data to "Results/Categorizer/ReviewsByCategories.txt". Error: ${error.message}`
    );
  });

  writeStream.end();
};

/**
 * Writes content to "Results/Categorizer/IncorrectlyCategorized.txt"
 * @param {*} results The array containing the formatted results
 */
const writeIncorrectlyCategorized = (results) => {
  const writeStream = fs.createWriteStream(
    "Results/Categorizer/IncorrectlyCategorized.txt"
  );

  results.forEach((result) => {
    const { review, realCategories, labeledCategory } = result;

    // Make the category names pretty for the output
    realCategories.forEach((category, index) =>
      realCategories.splice(index, 1, getNiceCategoryName(category))
    );
    const niceLabeledCategory = getNiceCategoryName(labeledCategory);

    if (!realCategories.includes(niceLabeledCategory)) {
      // Format the real categories for the output
      let formattedRealCategories = `"${realCategories}"`;
      if (realCategories.length === 2)
        formattedRealCategories = `"${realCategories.join(`" or "`)}"`;
      else if (realCategories.length > 2)
        formattedRealCategories = `"${realCategories
          .slice(0, realCategories.length - 1)
          .join(`", "`)}", or "${realCategories[realCategories.length - 1]}"`;

      // Write to the file
      writeStream.write(
        `"${review}"\n\tshould have been categorized as ${formattedRealCategories} but was categorized as "${niceLabeledCategory}".\n\n`
      );
    }
  });

  writeStream.on("error", (error) => {
    console.error(
      `Unable to write data to "Results/Categorizer/IncorrectlyCategorized.txt". Error: ${error.message}`
    );
  });

  writeStream.end();
};

/**
 * Make a category name pretty for writing to a file
 * @param {string} category The category to format for the output
 * @returns The pretty category
 */
const getNiceCategoryName = (category) => {
  if (category === "featureFunctionality") return "feature/functionality";
  else if (category === "gui") return "GUI";
  else if (category === "updatesVersions") return "updates/versions";
  else return category;
};

export {
  iterateThroughReviews,
  calculateProbActionableOfRealReview,
  formatBrainTrainingData,
  trainNeuralNetwork,
  writeResultsToFile,
  getTrainedNetwork,
  printEvaluationMetrics,
  printAverageMetrics,
  writeReviewsByCategories,
  writeIncorrectlyCategorized,
  getNiceCategoryName,
};
