import trainingActionableReviews from "../TrainingData/TrainingActionable.js";
import trainingUnactionableReviews from "../TrainingData/TrainingUnactionable.js";
import realActionableReviews from "../RealData/RealActionable.js";
import realUnactionableReviews from "../RealData/RealUnactionable.js";
import {
  calculateProbActionableOfRealReview,
  iterateThroughReviews,
  printEvaluationMetrics,
  writeResultsToFile,
} from "../HelperMethods.js";

const NaiveBayes = () => {
  // Preliminary work for steps 1 and 2
  // An object to keep track of the number of occurrences of each word in the training reviews
  let uniqueWordsInTrainingData = {};

  // Iterate through the actionable reviews
  uniqueWordsInTrainingData = iterateThroughReviews(
    uniqueWordsInTrainingData,
    trainingActionableReviews,
    true
  );

  // Iterate through the unactionable reviews
  uniqueWordsInTrainingData = iterateThroughReviews(
    uniqueWordsInTrainingData,
    trainingUnactionableReviews,
    false
  );

  // Compute the probabilities of each word in the training data set given that the review is actionable/unactionable
  let probWordsInTraining = {};
  Object.keys(uniqueWordsInTrainingData).forEach((word) => [
    (probWordsInTraining[word] = {
      // Step 1: compute the probability of each word in the training data set given that the review is actionable
      probGivenActionable:
        (uniqueWordsInTrainingData[word].actionable + 1) /
        (trainingActionableReviews.length + 2),
      // Step 2: compute the probability of each word in the training data set given that the review is unactionable
      probGivenUnactionable:
        (uniqueWordsInTrainingData[word].unactionable + 1) /
        (trainingUnactionableReviews.length + 2),
    }),
  ]);

  // Step 3: compute the probability of a review being actionable in the training data set
  const probActionable =
    trainingActionableReviews.length /
    (trainingActionableReviews.length + trainingUnactionableReviews.length);

  // Step 4: compute the probability of a review being unactionable in the training data set
  const probUnactionable =
    trainingUnactionableReviews.length /
    (trainingActionableReviews.length + trainingUnactionableReviews.length);

  // Step 5: calculate the probability that each real review is actionable
  let actionableProbabilities = [];
  realActionableReviews.forEach((review, index) => {
    actionableProbabilities[index] = calculateProbActionableOfRealReview(
      review,
      probWordsInTraining,
      probActionable,
      probUnactionable
    );
  });

  let unactionableProbabilities = [];
  realUnactionableReviews.forEach((review, index) => {
    unactionableProbabilities[index] = calculateProbActionableOfRealReview(
      review,
      probWordsInTraining,
      probActionable,
      probUnactionable
    );
  });

  // Step 6: Calculate the results
  let actionableLabeledCorrectly = [];
  let actionableLabeledIncorrectly = [];
  let unactionableLabeledCorrectly = [];
  let unactionableLabeledIncorrectly = [];

  // Go through the probabilities of the actionable reviews and classify them
  actionableProbabilities.forEach((probability, index) => {
    if (probability > 0.5)
      actionableLabeledCorrectly.push(realActionableReviews[index]);
    else actionableLabeledIncorrectly.push(realActionableReviews[index]);
  });

  // Go through the probabilities of the unactionable reviews and classify them
  unactionableProbabilities.forEach((probability, index) => {
    if (probability <= 0.5)
      unactionableLabeledCorrectly.push(realUnactionableReviews[index]);
    else unactionableLabeledIncorrectly.push(realUnactionableReviews[index]);
  });

  // Step 7: Add classified reviews to the associated files within the Results folder
  writeResultsToFile(
    actionableLabeledCorrectly,
    unactionableLabeledCorrectly,
    actionableLabeledIncorrectly,
    unactionableLabeledIncorrectly,
    "NaiveBayes"
  );

  // Step 8: Print the results to the console
  printEvaluationMetrics(
    "Naive Bayes",
    null,
    actionableLabeledCorrectly,
    actionableLabeledIncorrectly,
    unactionableLabeledCorrectly,
    unactionableLabeledIncorrectly
  );
};

export default NaiveBayes;
