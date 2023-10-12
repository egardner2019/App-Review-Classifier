# Naive Bayes Implementation for App Review Classification
This is a Naive Bayes implementation for classifying app reviews as actionable or unactionable.

The training data was generated with ChatGPT. The real data was manually gathered from the Google Play Store, Apple App Store, and Microsoft Store.

The results of running the classifier are as follows...

<b>Overall Accuracy:</b> 62.5%

<b>Number of reviews labeled as actionable:</b> 75

<b>Number of reviews labeled as unactionable:</b> 125

<b>Additional results can be found in the Results folder of this project:</b>
- AllActionable.txt contains the reviews that were classified as actionable by the classifier, regardless of their initial labeling.
- AllUnactionable.txt contains the reviews that were classified as unactionable by the classifier, regardless of their initial labeling.
- ActionableLabeledIncorrectly.txt contains the actionable reviews that were incorrectly labeled as unactionable by the classifier.
- UnactionableLabeledIncorrectly.txt contains the unactionable reviews that were incorrectly labeled as actionable by the classifier.
