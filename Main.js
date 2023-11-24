import NaiveBayes from "./Classifiers/NaiveBayes.js";
import NeuralNetwork from "./Classifiers/NeuralNetwork.js";
import Categorizer from "./Classifiers/Categorizer.js";
import { formatBrainTrainingData } from "./HelperMethods.js";

const Main = () => {
  // Run the Naive Bayes classifier
  // NaiveBayes();

  const formattedBrainTrainingData = formatBrainTrainingData();

  // Run the Gated Recurrent Unit classifier
  NeuralNetwork("GRU", formattedBrainTrainingData);

  // Run the Long Short-Term Neural Network classifier
  //NeuralNetwork("LSTM", formattedBrainTrainingData);

  // Categorize the reviews
  Categorizer();
};

Main();
