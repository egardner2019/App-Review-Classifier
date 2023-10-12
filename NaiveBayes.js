// To run the program, run "node NaiveBayes.js" within this project in the terminal
import trainingActionableReviews from "./TrainingData/TrainingActionable.js";
import trainingUnactionableReviews from "./TrainingData/TrainingUnactionable.js";
import realActionableReviews from "./RealData/RealActionable.js";
import realUnactionableReviews from "./RealData/RealUnactionable.js";
import {
  calculateProbActionableOfRealReview,
  iterateThroughReviews,
  writeResultsToFile,
} from "./HelperMethods.js";

const naiveBayes = () => {
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

  // Get the total number of incorrectly labeled reviews
  const numberOfIncorrectlyLabeledReviews =
    actionableLabeledIncorrectly.length + unactionableLabeledIncorrectly.length;

  // Get the total number of real reviews
  const numberOfRealReviews =
    actionableProbabilities.length + unactionableProbabilities.length;

  // Calculate the overall accuracy of the Naive Bayes implementation
  const overallAccuracy =
    1 - numberOfIncorrectlyLabeledReviews / numberOfRealReviews;

  // Step 7: Add classified reviews to the associated files within the Results folder
  // Print all of the reviews that were labeled as actionable
  const allReviewsLabeledActionable = actionableLabeledCorrectly.concat(
    unactionableLabeledIncorrectly
  );
  writeResultsToFile(allReviewsLabeledActionable, "AllActionable");

  // Print all of the reviews that were labeled as unactionable
  const allReviewsLabeledUnactionable = unactionableLabeledCorrectly.concat(
    actionableLabeledIncorrectly
  );
  writeResultsToFile(allReviewsLabeledUnactionable, "AllUnactionable");

  // Print the reviews that are actually actionable but were incorrectly labeled as unactionable
  writeResultsToFile(
    actionableLabeledIncorrectly,
    "ActionableLabeledIncorrectly"
  );

  // Print the reviews that are actually unactionable but were incorrectly labeled as actionable
  writeResultsToFile(
    unactionableLabeledIncorrectly,
    "UnactionableLabeledIncorrectly"
  );

  // Step 8: Print the results to the console
  console.log(`Overall Accuracy: ${overallAccuracy * 100}%`);

  console.log(
    "Number of reviews labeled as actionable: " +
      allReviewsLabeledActionable.length
  );

  console.log(
    "Number of reviews labeled as unactionable: " +
      allReviewsLabeledUnactionable.length
  );
};

// Run the program
naiveBayes();
