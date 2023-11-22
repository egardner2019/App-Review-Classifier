import brain from "brain.js";
import realActionableReviews from "./RealData/RealActionable.js";
import realUnactionableReviews from "./RealData/RealUnactionable.js";
import {
  getTrainedNetwork,
  trainNeuralNetwork,
  writeResultsToFile,
  printEvaluationMetrics,
} from "../HelperMethods.js";

/**
 * Create, train, and run a neural network
 * @param {"FNN" | "LSTM" | "RNN"} networkType The type of neural network to be used
 * @param trainingData The formatted training data
 */
const NeuralNetwork = (networkType, trainingData) => {
  let net;
  switch (networkType) {
    case "LSTM":
      // Create the Long-Short Term Memory Neural Network
      net = new brain.recurrent.LSTM();
      break;
    case "RNN":
      // Create the Recurrent Neural Network
      net = new brain.recurrent.RNN();
    default:
      // Create the Feedforward Neural Network
      net = new brain.NeuralNetwork();
      break;
  }

  // Check if a trained LSTM network has been saved
  const trainedNetworkJSON = getTrainedNetwork(networkType);

  // If a trained network was found, apply it to this network
  if (trainedNetworkJSON) {
    net.fromJSON(trainedNetworkJSON);
  }
  // If no trained network was found, train the network now and save it
  else {
    trainNeuralNetwork(trainingData, net, networkType);
  }

  let actionableClassified = [];
  let unactionableClassified = [];

  // Run the network on each real review
  realActionableReviews.forEach((review) =>
    actionableClassified.push(net.run(review))
  );
  realUnactionableReviews.forEach((review) =>
    unactionableClassified.push(net.run(review))
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
    networkType
  );

  // Print evaluation metrics to the console
  printEvaluationMetrics(
    networkType,
    correctActionable,
    incorrectActionable,
    correctUnactionable,
    incorrectUnactionable
  );
};

export default NeuralNetwork;
