# App Review Classification

This is a project to classify reviews in app stores. App reviews are classified as actionable/unactionable and put into the following categories (inspired by <a href="https://doi.org/10.1145/2950290.2950299">this research paper</a>).

- App (entire app, crash reports, rating, general feedback, notifications)
- GUI
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

The training data was generated with ChatGPT. The real data was manually gathered from the Google Play Store, Apple App Store, and Microsoft Store. I manually classified and categorized both the training reviews and the real reviews.
