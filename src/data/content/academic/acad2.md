Master's thesis exploring whether machine learning can help automate parts of the code review process.

Hypothesis:
By training models on historical code review data, we can predict which changes are likely to need revision and suggest specific improvements.

Dataset:
• 100,000+ pull requests from open source projects
• GitHub code review comments and outcomes
• Code diff analysis and AST features

Model Architecture:
Fine-tuned CodeBERT model for understanding code semantics, combined with traditional ML features for metadata and diff statistics.

Results:
• 82% accuracy in predicting review outcomes
• Generated suggestions aligned with actual reviewer feedback 65% of the time
• Reduced average review time by 30% in pilot study

Future Work:
Exploring ways to make suggestions more explainable and integrating with IDE workflows.

Published in ACM Conference on Software Engineering Education and Training.