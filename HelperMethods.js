const splitReviewIntoWords = (review) => {
  // Split each review sentence by spaces
  let reviewWords = review.split(" ");

  // For each word in the review, remove any punctuation and change the word to lowercase
  reviewWords.forEach((word, index) => {
    reviewWords[index] = word
      .toLowerCase()
      .replace(".", "")
      .replace(",", "")
      .replace("?", "");
  });

  return reviewWords;
};

const iterateThroughReviews = (
  uniqueWordsInTrainingData,
  reviewArray,
  isActionable
) => {
  // Iterate through the reviews in the array
  reviewArray.forEach((review) => {
    // Split each review sentence into words
    const reviewWords = splitReviewIntoWords(review);

    // Update uniqueWordsInTrainingData for each word in the review
    reviewWords.forEach((word) => {
      // If the word isn't in uniqueWordsInTrainingData, add it and set the initial count
      if (!(word in uniqueWordsInTrainingData))
        uniqueWordsInTrainingData[word] = {
          actionable: isActionable ? 1 : 0,
          unactionable: isActionable ? 0 : 1,
        };
      // If the word is in uniqueWordsInTrainingData, increment the count for that review type
      else
        uniqueWordsInTrainingData[word][
          isActionable ? "actionable" : "unactionable"
        ]++;
    });
  });

  // Return the updated object with the words from the reviews
  return uniqueWordsInTrainingData;
};

const calculateProbActionableOfRealReview = (
  review,
  probWordsInTraining,
  probActionable,
  probUnactionable
) => {
  let probRealReviewsWords = {};

  // Split each real review sentence into words
  const reviewWords = splitReviewIntoWords(review);

  // Iterate through the words in the review
  reviewWords.forEach((word) => {
    // If the word exists in the training data, add those probabilities to probRealReviewsWords
    if (word in probWordsInTraining)
      probRealReviewsWords[word] = probWordsInTraining[word];
  });

  // Find the product of the probabilities of the word given actionable and unactionable for each word in the real review
  let productProbWordGivenActionable = 1;
  let productProbWordGivenUnactionable = 1;
  Object.keys(probRealReviewsWords).forEach((word) => {
    productProbWordGivenActionable *=
      probRealReviewsWords[word].probGivenActionable;
    productProbWordGivenUnactionable *=
      probRealReviewsWords[word].probGivenUnactionable;
  });

  // Compute the overall probability of the real review being actionable and return that value
  return (probReviewActionable =
    (probActionable * productProbWordGivenActionable) /
    (probActionable * productProbWordGivenActionable +
      probUnactionable * productProbWordGivenUnactionable));
};

const filterIncorrectlyLabelledReviews = (
  realReviewsProbArray,
  shouldBeActionable
) => {
  // Filter out the correctly labelled reviews
  return realReviewsProbArray.filter(
    (probability) =>
      (probability > 0.5 && shouldBeActionable) ||
      (probability <= 0.5 && !shouldBeActionable)
  );
};

const getTotalByLabel = (allLabelledReviews, isActionable) => {
  return allLabelledReviews.filter((probability) =>
    isActionable ? probability > 0.5 : probability <= 0.5
  ).length;
};

export {
  iterateThroughReviews,
  calculateProbActionableOfRealReview,
  filterIncorrectlyLabelledReviews,
  getTotalByLabel,
};
