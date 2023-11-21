import NaiveBayes from "./Classifiers/NaiveBayes.js";
import FNN from "./Classifiers/FNN.js";
import RNN from "./Classifiers/RNN.js";
import LSTM from "./Classifiers/LSTM.js";
import Categorizer from "./Classifiers/Categorizer.js";

const Main = () => {
  // Run the Naive Bayes classifier
  NaiveBayes();

  // Run the Feedforward Neural Network classifier
  FNN();

  // Run the Recurrent Neural Network classifier
  RNN();

  // Run the Long Short-Term Neural Network classifier
  LSTM();

  // Categorize the reviews
  Categorizer();
};

Main();
