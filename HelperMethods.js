import * as fs from "fs";

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
 * Write the results of running the classifier to the files in the Results folder.
 * @param {string[]} data An array containing the textual reviews to add to the file
 * @param {"AllActionable" | "AllUnactionable" | "ActionableLabeledIncorrectly" | "UnactionableLabeledIncorrectly"} fileName The file that will be written
 */
const writeResultsToFile = (data, fileName) => {
  if (data.length > 0) {
    const writeStream = fs.createWriteStream(`Results/${fileName}.txt`);

    data.forEach((review) => writeStream.write(`${review}\n`));

    writeStream.on("finish", () => {
      console.log(`Wrote ${data.length} reviews to ${fileName}.txt.`);
    });

    writeStream.on("error", (error) => {
      console.error(
        `Unable to write data to ${fileName}.txt. Error: ${error.message}`
      );
    });

    writeStream.end();
  } else console.log(`There is no data to be written to ${fileName}.txt.`);
};

export {
  iterateThroughReviews,
  calculateProbActionableOfRealReview,
  writeResultsToFile,
};
