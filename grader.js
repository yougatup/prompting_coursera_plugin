exports.gradeAnswer = function(graderConfig, sessionConfig, answer) {
  const isCorrect = true;
  const feedback = isCorrect ? "Great job, you chose correctly!!" : "Nope, try again.";

  return {
    isCorrect: isCorrect,
    feedback: feedback,
    feedbackConfiguration: {
      stateId: answer.stateId,
      feedback,
      isCorrect
    }
  };
};
