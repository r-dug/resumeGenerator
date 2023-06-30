import { useState, useEffect, useContext, React} from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
const Main = () => {
    // hooks
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
    const [resumeValue, setResumeValue] = useState('')
    const [jobValue, setJobValue] = useState('')
    const [optimizedResume, setOptimizedResume] = useState(null)
    const [optimizedCover, setOptimizedCover] = useState(null)
    const [assessment, setAssessment] = useState(null)
    const [jobSummary, setJobSummary] = useState(null)
    const [ViewResume, setViewResume] = useState(null)
    const [ViewCover, setViewCover] = useState(null)
    const [ViewAssessment, setViewAssessment] = useState(null)
    const [view, setView] = useState('input')
    const [historyData, setHistoryData] = useState([])
    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        if (optimizedResume !== null && optimizedCover !== null && jobSummary !== null && assessment !== null) {
            sendDataToServer();
            setViewResume(optimizedResume);
            setViewCover(optimizedCover);
            setViewAssessment(assessment);
            resetVals()
            setView('resume');
          alert("Your application docs are ready!")
        }
      }, [optimizedResume, optimizedCover, jobSummary, assessment]);
      
    useEffect(() => {
        try{
            const fetchHistory = async () => {
                const response = await fetch(`${API_URL}/historyGet`, {
                    method: 'GET',
                    headers:{
                        id: user
                    }
                });

                const data = await response.json();
                setHistoryData(data);
                }
        fetchHistory();
        }catch (error) {
        console.log(error)
        alert("OH NO! we couldn't get the history from the server.")
        }
    }, [user]);

    
    // a bunch of function expressions

    // this function doesn't really do anything but I wanted to possibly clean up and enhance file handling
    // const submitFile = async () => {
    //   if (!file) return;

    //   const formData = new FormData();
    //   formData.append('file', file);

    //   try {
    //     const response = await fetch('/upload', {
    //       method: 'POST',
    //       body: formData,
    //     });

    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }

    //     const responseBody = await response.text();
    //     alert(responseBody);
    //   } catch (error) {
    //     console.error('Error:', error);
    //     alert('Error uploading file');
    //   }
    // }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
        const content = e.target.result;
        setResumeValue(content);
        };

        reader.readAsText(file);
    }
    
    const updatePrompts = async (type) => {
        let prompt
        if (type === 'resume') {
        prompt = `
        If the text between the sets of five asterisks is a resume and the text between the sets of five percent symbols is a job description, tailor the resume for the job description.
        Otherwise, simply say "INVALID INPUT".
        \nAdhere stricly to the facts contained in the original resume and be sure not to include skills or experience the applicant does not have.
        \nYou may, however, insert keywords from the job description. For example, the job description asks for "cybersecurity" but resume lists "CompTIA Security+" but not "cybersecurity" specifically. insert cybersecurity since it is relevant to the applicant but not in the resume. However, if the resume lists something more specific like a "CISSP" certification as a desired qualification, but the resume does not include it- do not insert it.
        \n***** \n${resumeValue} \n***** \n\n%%%%% \n${jobValue} \n%%%%%`
        } else if (type === 'coverLetter') {
        prompt = `create a cover letter using info from the resume between two sets of five asterisks and the job application between the two sets of five percent symbols
        if the value between the asterisks is not a job description or the input between the percent symbols is not a job description say "INVALID INPUT"\n
        \n*****\n${optimizedResume}\n*****\n\n%%%%%\n${jobValue}\n%%%%% `
        } else if (type === 'jobFit') {
        prompt = `do you think the resume between two sets of five asterisks portrays a strong candidate for the job description between two sets of five percent symbols?
        \n Are there any skills or knowledge gaps the candidate should address? If so, do you have any recommendations for the applicant?
        \n*****\n${optimizedResume}\n*****\n\n%%%%%\n${jobValue}\n%%%%% `
        }else if (type === 'summary') {
        prompt = `If the job description listed between two sets of five asterisks contains the company's name, output the company name.
        Otherwise, summarize the job description in exactly four words. 
        If you do not see a job description between the two sets of five asterisks, say 'Not a real job'. 
        \n
        \n*****\n${jobValue}\n*****`
        }
        return prompt
    }

    const openAiReq = async (script, valueupdate) => {
        const options = {
        method: "POST",
        body: JSON.stringify({
            prompt: script
        }),
        headers:{
            "Content-Type": "application/json"
        },
        }
        try{
        const response = await fetch(`${API_URL}/completions`, options)
        const data = await response.json()
        return data
        } catch(error){
        console.error(error)
        }
    }

    const getCompletions = async () => {
        let values = ['resume', 'summary', 'coverLetter', 'jobFit']
                    
        for  (const val of values) {
            let prompt = await updatePrompts(val)
            let data = await Promise.allSettled([openAiReq(prompt, val)])
            let content = data[0].value.choices[0].message.content.toString().replace(/\n/g, "<br>")
            if(data.length > 0){
                updateVals(content, val)
            } else {
                console.error('Invalid data received', data);
            }
        }

    }

    const updateVals = (data, valueupdate) => {
        if (valueupdate === "resume") {
            setOptimizedResume(data);
        }else if (valueupdate === "summary") {
            setJobSummary(data);
        } else if (valueupdate === "coverLetter") {
            setOptimizedCover(data.replace(/\n/g, "<br>"));
        } else if (valueupdate === "jobFit") {
            setAssessment(data.replace(/\n/g, "<br>"));
        }
    }
        
    const resetVals = () => {
        setOptimizedResume(null)
        setJobSummary(null)
        setOptimizedCover(null)
        setAssessment(null)
    }

    const sendDataToServer = async () => {
        const document = {
        optimizedResume: optimizedResume,
        optimizedCover: optimizedCover,
        assessment: assessment,
        summary: jobSummary,
        date: new Date(),
        userid: user
        }
        try {
        const response = await fetch(`${API_URL}/historyPost`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            id: user
            },
            body: JSON.stringify(document),
        })
        if (!response.ok) {
            throw new Error(`HTTP error sending data to server! \n **************************\nstatus: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        }
    }

    useEffect(() => {
        if (optimizedResume !== null && optimizedCover !== null && jobSummary !== null && assessment !== null) {
            sendDataToServer();
            setViewResume(optimizedResume);
            setViewCover(optimizedCover);
            setViewAssessment(assessment);
            resetVals()
            setView('resume');
          alert("Your application docs are ready!")
        }
      }, [optimizedResume, optimizedCover, jobSummary, assessment]);
      
    useEffect(() => {
        try{
            const fetchHistory = async () => {
                const response = await fetch(`${API_URL}/historyGet`, {
                    method: 'GET',
                    headers:{
                        id: user
                    }
                });

                const data = await response.json();
                setHistoryData(data);
                }
        fetchHistory();
        }catch (error) {
        console.log(error)
        alert("OH NO! we couldn't get the history from the server.")
        }
    }, [user]);

    return (
        <div className="app">
        <section className="side-bar">

            {/* this will be a router component*/}
            <button id="createresume" onClick={() => setView('input')}>
            + Create application profile
            </button>

            {/* this will be a router component*/}
            <ul className="history">
            {historyData.map((item, index) => (
                <li key={index} onClick={() => {
                setViewResume(item.optimizedResume);
                setViewCover(item.optimizedCover);
                setViewAssessment(item.assessment);
                setView('resume')
            }}>
                {/* Display relevant fields from item */}
                {item.date.slice(0,10)}
                {<br></br>}
                {item.date.slice(10,-5)}
                {<br></br>}
                {<br></br>}
                {item.summary}
                </li>
            ))}
            </ul>
            <nav>
            <p>This section contains your application profiles</p>
            </nav>
        </section>
        {/* this will be a router component*/}
        <section className='main'>
            <h1>Resume Generator</h1>
            {view === 'input' && (
            <div>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='inputArea'>
                <label htmlFor="baseResume">Please insert a resume to optimize.</label><br></br><br></br>
                <input type="file"  id="baseResume" name="baseResume" accept=".txt" onChange={handleFileChange}></input><br></br><br></br>
                <label htmlFor="jobdescription">Please insert a job description.</label><br></br><br></br>
                <textarea rows="20" cols="50" id="jobdescription" name="jobdescription" onChange={(e)=>setJobValue(e.target.value)}></textarea> <br></br><br></br>
                </div>
                <div className='navBarBottom'>
                <button onClick={() => window.location.reload()}>Reload</button><br></br><br></br>
                <button onClick={async () => {
                    setView('loading')
                    await Promise.allSettled([getCompletions()])
                }}>Generate Assistance on Application!</button>
                </div>
            </div>
            )}
            {view === 'loading' && (
            <div>
                LOADING
            </div>
            )}
            {view === 'resume' && (
            <div>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='displayArea'>
                <p>Optimized Resume:</p>
                <p dangerouslySetInnerHTML={{__html: ViewResume}} />
                </div>
                <div className='bottomButtons'>
                <button onClick={() => window.location.reload()}>Reload</button>
                </div>
            </div>
            )}
            {view === 'coverLetter' && (
            <div>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='displayArea'>
                <p>Optimized Cover Letter: </p>
                <p dangerouslySetInnerHTML={{__html: ViewCover}} />
                </div>
            <div className='bottomButtons'>
                <button onClick={() => window.location.reload()}>Reload</button>
            </div>
            </div>
            )}
            {view === 'jobFit' && (
            <div>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='displayArea'>
                <p> Assessment: </p>
                <p dangerouslySetInnerHTML={{__html: ViewAssessment}} />
                </div>
                <div className='bottomButtons'>
                <button onClick={() => window.location.reload()}>Reload</button>
                </div>
            </div>
            )}
        </section>
        </div>
    );
}

export default Main;

// GPT suggestions:
// Performance improvements:

//     Avoiding Multiple Render Triggers: The useEffect hook is used to trigger certain actions based on the values of optimizedResume, optimizedCover, jobSummary, and assessment. However, it's important to note that the useEffect hook is triggered on every render. To avoid unnecessary triggers, you can consider using separate state variables for each action or combining them into a single state object. This way, you can have more granular control over when each action should be triggered.

//     Error Handling: The code could benefit from better error handling in certain parts, such as handling errors during API requests or displaying error messages to the user in case of failures. Consider implementing proper error handling and displaying user-friendly error messages when needed.

//     Conditional Rendering: The code uses conditional rendering based on the view state variable. While this approach works, it can become difficult to manage when the application grows with more views and complex conditions. Consider using a router library (e.g., React Router) to manage routing and rendering different views based on the URL.

//     File Handling: The code includes commented-out file handling code. If file handling functionality is required, you can uncomment the code and make necessary modifications. However, ensure that appropriate error handling and validation are implemented to handle different scenarios and provide meaningful feedback to the user.

//     Code Cleanup: There are commented-out sections of code that are not being used. It's a good practice to remove such unused code to keep the codebase clean and maintainable.