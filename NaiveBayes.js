// To run the program, run "node NaiveBayes.js" within this project in the terminal

import trainingActionableReviews from "./TrainingData/TrainingActionable.js";
import trainingUnactionableReviews from "./TrainingData/TrainingUnactionable.js";
import realActionableReviews from "./RealData/RealActionable.js";
import realUnactionableReviews from "./RealData/RealUnactionable.js";
import {
  calculateProbActionableOfRealReview,
  filterIncorrectlyLabeledReviews,
  getTotalByLabel,
  iterateThroughReviews,
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
  // Determine which actionable reviews were incorrectly labeled as unactionable
  const actionableIncorrectlyLabeled = filterIncorrectlyLabeledReviews(
    actionableProbabilities,
    true
  );
  // Determine which unactionable reviews were incorrectly labeled as actionable
  const unactionableIncorrectlyLabeled = filterIncorrectlyLabeledReviews(
    unactionableProbabilities,
    true
  );

  // Gather all of the incorrectly labeled reviews
  const allIncorrectlyLabeledReviews = actionableIncorrectlyLabeled.concat(
    unactionableIncorrectlyLabeled
  );

  // Gather all of the labeled reviews
  const allLabeledReviewsProbabilities = actionableProbabilities.concat(
    unactionableProbabilities
  );

  // Calculate the overall accuracy of the Naive Bayes implementation
  const overallAccuracy =
    1 -
    allIncorrectlyLabeledReviews.length /
      allLabeledReviewsProbabilities.length;

  // Calculate the total number of reviews labeled as actionable
  const totalLabeledActionable = getTotalByLabel(
    allLabeledReviewsProbabilities,
    true
  );

  // Calculate the total number of reviews labeled as unactionable
  const totalLabeledUnactionable = getTotalByLabel(
    allLabeledReviewsProbabilities,
    false
  );

  // Print the results to the console
  console.log(`Overall Accuracy: ${overallAccuracy * 100}%`);
  console.log(
    "Number of reviews labeled as actionable: " + totalLabeledActionable
  );
  console.log(
    "Number of reviews labeled as unactionable: " + totalLabeledUnactionable
  );
  console.log(
    `The following ${actionableIncorrectlyLabeled.length} reviews are actionable but were labeled incorrectly as unactionable: `
  );
  actionableIncorrectlyLabeled.forEach((review) => console.log(`- ${review}`));

  console.log(
    `The following ${unactionableIncorrectlyLabeled.length} reviews are unactionable but were labeled incorrectly as actionable:`
  );
  unactionableIncorrectlyLabeled.forEach((review) => console.log(`- ${review}`));
};

// Run the program
naiveBayes();
