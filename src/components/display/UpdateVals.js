

const updateVals = async (data, valueupdate) => {
    if (valueupdate === "resume") {
      setOptimizedResume(data.choices[0].message.content.replace(/\n/g, "<br>"));
      // sendDataToServer(data.choices[0].text, optimizedCover, assessment);
    }else if (valueupdate === "summary") {
      setJobSummary(data.choices[0].message.content);
    } else if (valueupdate === "coverLetter") {
      setOptimizedCover(data.choices[0].message.content.replace(/\n/g, "<br>"));
      // sendDataToServer(optimizedResume, data.choices[0].text, assessment);
    } else if (valueupdate === "jobFit") {
      setAssessment(data.choices[0].message.content.replace(/\n/g, "<br>"));
      sendDataToServer();
    }
return updateVals  
}
export default updateVals