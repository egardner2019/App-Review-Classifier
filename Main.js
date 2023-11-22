import NaiveBayes from "./Classifiers/NaiveBayes.js";
import NeuralNetwork from "./Classifiers/NeuralNetwork.js";
import Categorizer from "./Classifiers/Categorizer.js";
import { formatBrainTrainingData } from "./HelperMethods.js";

// TODO: implement the categorizer
// TODO: Uncomment the training data and run all networks on all data

const Main = () => {
  // Run the Naive Bayes classifier
  NaiveBayes();

  const formattedBrainTrainingData = formatBrainTrainingData();

  // Run the Gated Recurrent Unit classifier
  NeuralNetwork("GRU", formattedBrainTrainingData);

  // Run the Recurrent Neural Network classifier
  NeuralNetwork("RNN", formattedBrainTrainingData);

  // Run the Long Short-Term Neural Network classifier
  NeuralNetwork("LSTM", formattedBrainTrainingData);

  // Categorize the reviews
  Categorizer();
};

Main();
