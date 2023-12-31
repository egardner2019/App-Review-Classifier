import CFC from "cfc-classifier";
import { trainingCategorizedReviews } from "../TrainingData/TrainingCategories.js";
import realCategorizedReviews from "../RealData/RealCategories.js";
import {
  printAverageMetrics,
  printEvaluationMetrics,
  writeIncorrectlyCategorized,
  writeReviewsByCategories,
} from "../HelperMethods.js";

const Categorizer = () => {
  // Format the real review data for the categorizer
  const formattedCategorizedReviews = {
    app: [],
    gui: [],
    contents: [],
    pricing: [],
    featureFunctionality: [],
    improvement: [],
    updatesVersions: [],
    resources: [],
    security: [],
    model: [],
    company: [],
  };
  trainingCategorizedReviews.forEach((reviewObj) => {
    formattedCategorizedReviews[reviewObj.category].push(reviewObj.review);
  });

  const allCategories = Object.keys(formattedCategorizedReviews);

  // Create and train the Class Feature Centroid classifier
  const cfc = new CFC(
    allCategories,
    Object.values(formattedCategorizedReviews)
  );
  cfc.train();

  const categorizedResults = {
    app: [],
    gui: [],
    contents: [],
    pricing: [],
    featureFunctionality: [],
    improvement: [],
    updatesVersions: [],
    resources: [],
    security: [],
    model: [],
    company: [],
  };

  // Run the categorizer on the real data
  let formattedResults = [];
  realCategorizedReviews.forEach((reviewObj) => {
    let cfcResult = cfc.classify(reviewObj.review);
    categorizedResults[cfcResult].push(reviewObj.review);
    formattedResults.push({
      review: reviewObj.review,
      realCategories: reviewObj.categories,
      labeledCategory: cfcResult,
    });
  });

  // Evaluate results (calculate accuracy, precision, recall, and F-score for each category, and the average of each metric across categories)
  // Create an array to hold the evaluation metrics of each category
  let categoryEvalMetrics = [];
  allCategories.forEach((category) => {
    let truePos = []; // The real categories contains this category and this category is the labeled category
    let falseNeg = []; // The real categories contain this category, but this category isn't the labeled category
    let trueNeg = []; // The real categories don't contain this category and this category isn't the labeled category
    let falsePos = []; // The real categories don't contain this category, but this category is the labeled category

    formattedResults.forEach((result) => {
      const realIncludesCategory = result.realCategories.includes(category);
      const labelIsCategory = result.labeledCategory === category;
      // True positive
      if (realIncludesCategory && labelIsCategory) {
        truePos.push(result.review);
      }
      // False negative
      else if (realIncludesCategory && !labelIsCategory) {
        falseNeg.push(result.review);
      }
      // True negative
      else if (!realIncludesCategory && !labelIsCategory) {
        trueNeg.push(result.review);
      }
      // False positive (!realIncludesCategory && labelIsCategory)
      else {
        falsePos.push(result.review);
      }
    });

    // Get the results for the category, add it to the array, and print to the console
    categoryEvalMetrics.push(
      printEvaluationMetrics(
        "Categorizer",
        category,
        truePos,
        falseNeg,
        trueNeg,
        falsePos
      )
    );
  });

  // Print the average metrics from all the categories
  printAverageMetrics(categoryEvalMetrics, false);

  // Print the reviews by their resulting categorization
  writeReviewsByCategories(allCategories, categorizedResults);

  // Print the reviews that were incorrectly categorized
  writeIncorrectlyCategorized(formattedResults);
};

export default Categorizer;
