import NaiveBayes from "./Classifiers/NaiveBayes.js";
import NeuralNetwork from "./Classifiers/NeuralNetwork.js";
import Categorizer from "./Classifiers/Categorizer.js";
import { formatBrainTrainingData, createAndRunNeuralNetwork } from "./HelperMethods.js";

// TODO: get FNN working
// TODO: implement the classifier
// TODO: Uncomment the training data and run all networks on all data

const Main = () => {
  // Run the Naive Bayes classifier
  NaiveBayes();

  const formattedBrainTrainingData = formatBrainTrainingData();

  // Run the Feedforward Neural Network classifier
  // TODO: figure out how to format the data for the FNN
  // NeuralNetwork("FNN", formattedBrainTrainingData);

  // Run the Recurrent Neural Network classifier
  NeuralNetwork("RNN", formattedBrainTrainingData);

  // Run the Long Short-Term Neural Network classifier
  NeuralNetwork("LSTM", formattedBrainTrainingData);

  // Categorize the reviews
  Categorizer();
};

Main();
