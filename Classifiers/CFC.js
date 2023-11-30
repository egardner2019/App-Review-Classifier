import CFC from "cfc-classifier";
import trainingActionableReviews from "../TrainingData/TrainingActionable.js";
import trainingUnactionableReviews from "../TrainingData/TrainingUnactionable.js";
import realActionableReviews from "../RealData/RealActionable.js";
import realUnactionableReviews from "../RealData/RealUnactionable.js";
import { writeResultsToFile, printEvaluationMetrics } from "../HelperMethods.js";

const CFCClassifier = () => {
  // Create and train the Class Feature Centroid classifier
  const cfc = new CFC(
    ["actionable", "unactionable"],
    [trainingActionableReviews, trainingUnactionableReviews]
  );
  cfc.train();

  let actionableClassified = [];
  let unactionableClassified = [];

  // Run the network on each real review
  realActionableReviews.forEach((review) =>
    actionableClassified.push(cfc.classify(review))
  );
  realUnactionableReviews.forEach((review) =>
    unactionableClassified.push(cfc.classify(review))
  );

  // Determine the results
  let correctActionable = []; // Labeled actionable and really actionable (TP)
  let incorrectActionable = []; // Labeled unactionable but really actionable (FN)
  let correctUnactionable = []; // Labeled unactionable and really unactionable (TN)
  let incorrectUnactionable = []; // Labeled actionable but really unactionable (FP)

  // Put the actionable reviews into the correct/incorrect array
  actionableClassified.forEach((classification, index) => {
    const thisReview = realActionableReviews[index];
    if (classification === "actionable") {
      correctActionable.push(thisReview);
    } else {
      incorrectActionable.push(thisReview);
    }
  });

  // Put the unactionable reviews into the correct/incorrect array
  unactionableClassified.forEach((classification, index) => {
    const thisReview = realUnactionableReviews[index];
    if (classification === "unactionable") {
      correctUnactionable.push(thisReview);
    } else {
      incorrectUnactionable.push(thisReview);
    }
  });

  // Write the results to the associated files
  writeResultsToFile(
    correctActionable,
    correctUnactionable,
    incorrectActionable,
    incorrectUnactionable,
    "CFC"
  );

  // Print evaluation metrics to the console
  return printEvaluationMetrics(
    "CFC Classifier",
    null,
    correctActionable,
    incorrectActionable,
    correctUnactionable,
    incorrectUnactionable
  );
};

export default CFCClassifier;
