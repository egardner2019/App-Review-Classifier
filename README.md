# App Review Classification/Categorization

<h2>About the Project</h2>

This is a project to classify and categorize reviews in app stores. App reviews are classified as actionable/unactionable and put into the following categories (inspired by <a href="https://doi.org/10.1145/2950290.2950299">this research paper</a>).

- App (entire app, crash reports, rating, general feedback, notifications)
- GUI (graphical user interface)
- Contents
- Pricing (in-app purchases, subscriptions, cost of app, advertisements)
- Feature/functionality (specific features/functionality)
- Improvement (explicit enhancement requests)
- Updates/versions (specific versions or update process)
- Resources (battery consumption, storage, etc.)
- Security (app security or personal data privacy)
- Model (specific device/OS versions)
- Company

Four evaluation methods were used to classify app reviews as actionable/unactionable:

1. Naive Bayes
2. Gated Recurrent Unit (GRU)
3. Long Short-Term Memory Neural Network (LSTM)
4. Class Feature Centroid (CFC)

Note: The use of a recurrent neural network (RNN) and a feedforward neural network (FNN) was attempted, but they failed to train.

I manually implemented the Naive Bayes classifier using the steps described in <a href="https://courses.cs.washington.edu/courses/cse312/18sp/lectures/naive-bayes/naivebayesnotes.pdf">this research paper</a>. GRU and LSTM use the <a href="https://www.npmjs.com/package/brain.js">brain.js npm package</a>. For the CFC classification and categorization, I used the <a href="https://www.npmjs.com/package/cfc-classifier">cfc-classifier npm package</a>, which categorizes text based on the approach described in <a href="https://dl.acm.org/doi/abs/10.1145/1526709.1526737">this article</a>.

The training data was generated with ChatGPT. The real data was manually gathered from the Google Play Store, Apple App Store, and Microsoft Store. I manually categorized both the training reviews and the real reviews. The training reviews were classified when they were generated, however, I classified the real reviews.

<h2>Results</h2>

<h3>Classification (Actionable/Unactionable)</h3>

The following results are represented in percentages.

| | Naive Bayes | CFC | GRU | LSTM |
| --- | --- | --- | --- | --- |
| Accuracy | 59.5 | 66 | 56 | 57.5 |
| Precision | 67.27 | 61.76 | 63.04 | 54.29 |
| Recall | 37 | 84 | 29 | 95 |

As you can see, CFC was the most accurate, Naive Bayes was the most precise, and LSTM had the highest recall.

<h3>Categorization (Using CFC)</h3>

| | Average | App | GUI | Contents | Pricing | Feature/Functionality | Improvement | Updates/Versions | Resources | Security | Model | Company |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accuracy | 81.45 | 66.5 | 77 | 65 | 81.5 | 71 | 82.5 | 87.5 | 88 | 93.5 | 89.5 | 94 |
| Precision | 34.88 | 52.78 | 8.33 | 47.06 | 93.48 | 0 | 55.56 | 37.04 | 20 | 0 | 25 | 44.44 |
| Recall | 23.35 | 27.54 | 2.78 | 11.59 | 55.84 | 0 | 13.89 | 55.56 | 33.33 | 0 | 20 | 36.36 |

The first column with data (Average) contains the average accuracy, precision, and recall across all 11 categories.

<h2>How to Reproduce/Modify Results</h2>

To run this program on your computer, complete the following steps...

1. Clone/download this repository to your computer.
2. Open a terminal and complete the following steps from within the root directory of the project.
    1. Run `npm install` to install the necessary npm packages.
        - If you run into issues installing brain.js, complete the following steps (solution found <a href="https://stackoverflow.com/questions/71810987/i-got-this-error-when-i-was-trying-to-install-brain-js-with-npm-i-wrote-npm-i">here</a>).
            1. Run `npm install --save brain.js@1.4.10` to install an older version of brain.js.
            2. Run `npm install brain.js` to install the latest version of brain.js.
    2. Run `npm run test` to run the application.
    3. View the evaluation results within the terminal and the specific classified/categorized reviews within the Results directory.
3. If you would like to re-train the neural networks (GRU and LSTM), complete the following steps. By default, the pre-trained neural networks (with 500 iterations) will be used.
    1. Delete/rename the existing `GRU.json` and/or `LSTM.json` file(s) within the `TrainedNeuralNetworks` directory.
    2. Modify to your liking the parameters of the `neuralNetwork.train(...)` call within the `trainNeuralNetwork` function of the `HelperMethods.js` file. More details on the available parameters are available <a href="https://www.npmjs.com/package/brain.js?activeTab=readme#training-options">here</a>.
4. If you would like to modify the training/real reviews, complete the following steps and then re-train the neural networks as in step 3 above.
    - To modify training reviews, modify the corresponding files/arrays within the `TrainingData` directory of this project.
        - To add to the actionable reviews, add (a) plain string(s) to the `trainingActionableReviews` array within the `TrainingActionable.js` file.
        - To add to the unactionable reviews, add (a) plain string(s) to the `trainingUnactionableReviews` array within the `TrainingUnactionable.js` file.
        - To add to the categorized reviews, add (an) object(s) to the `trainingCategorizedReviews` array within the `TrainingCategories.js` file. The object(s) must contain a `review` value (string) and a single `category` value (a value within the `categories` object declared in that same file — categories.app, categories.gui, categories.contents, etc.).
    - To modify real reviews, modify the corresponding files/arrays within the `RealData` directory of this project.
        - To add to the actionable reviews, add (a) plain string(s) to the `realActionableReviews` array within the `RealActionable.js` file.
        - To add to the unactionable reviews, add (a) plain string(s) to the `realUnactionableReviews` array within the `RealUnactionable.js` file.
        - To add to the categorized reviews, add (an) object(s) to the `realCategorizedReviews` array within the `RealCategories.js` file. The object(s) must contain a `review` value (string) and a `categories` value (array of values within the `categories` object extracted in that same file — app, gui, contents, etc.).
