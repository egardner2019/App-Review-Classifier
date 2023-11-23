import CFC from "cfc-classifier";
import { trainingCategorizedReviews } from "../TrainingData/TrainingCategories.js";
import realCategorizedReviews from "../RealData/RealCategories.js";

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

  // Create and train the Class Feature Centroid classifier
  const cfc = new CFC(
    Object.keys(formattedCategorizedReviews),
    Object.values(formattedCategorizedReviews)
  );
  cfc.train();

  // Run the categorizer on the real data
  let results = [];
  realCategorizedReviews.forEach((reviewObj, index) => {
    results[index] = cfc.classify(reviewObj.review);
  });

  // TO BE REMOVED: To make sure everything works...
  results.forEach((result, index) => {
    console.log("Review:", realCategorizedReviews[index].review);
    console.log("Real category:", realCategorizedReviews[index].categories);
    console.log("Category from classifier:", result);
  });

  // Evaluate results (calculate accuracy, precision, recall for each category. also calculate average of each metric for each category)

  // Print the reviews by their resulting categorization

  // Print the reviews that were incorrectly categorized
};

export default Categorizer;
