import NaiveBayes from "./Classifiers/NaiveBayes.js";
import CFCClassifier from "./Classifiers/CFC.js";
import NeuralNetwork from "./Classifiers/NeuralNetwork.js";
import Categorizer from "./Classifiers/Categorizer.js";
import {
  formatBrainTrainingData,
  printAverageMetrics,
} from "./HelperMethods.js";

const Main = () => {
  const metrics = [];

  // Run the Naive Bayes classifier and add the eval metrics to the metrics array
  metrics.push(NaiveBayes());

  // Use CFC to classify reviews as actionable/unactionable and add the eval metrics to the metrics array
  metrics.push(CFCClassifier());

  const formattedBrainTrainingData = formatBrainTrainingData();

  // Run the Gated Recurrent Unit classifier and add the eval metrics to the metrics array
  metrics.push(NeuralNetwork("GRU", formattedBrainTrainingData));

  // Run the Long Short-Term Neural Network classifier and add the eval metrics to the metrics array
  metrics.push(NeuralNetwork("LSTM", formattedBrainTrainingData));

  // Print the average metrics across classifier methods
  printAverageMetrics(metrics, true);

  // Categorize the reviews
  Categorizer();
};

Main();
