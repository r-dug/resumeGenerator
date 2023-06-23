import { useState, useEffect } from "react";
// import RegistrationForm from  "./../Account_Creation/Account_Creation"
import { App } from "./../../App"
import { UserContext } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';

const Main = () => {

    const [resumeValue, setResumeValue] = useState('')
    const [jobValue, setJobValue] = useState('')
    const [optimizedResume, setOptimizedResume] = useState('')
    const [optimizedCover, setOptimizedCover] = useState('')
    const [assessment, setAssessment] = useState('')
    const [view, setView] = useState('input')
    const [historyData, setHistoryData] = useState([])
    const [jobSummary, setJobSummary] = useState('')
    const [file, setFile] = useState()

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

    const navigate = useNavigate();

    if (!UserContext){
        navigate('/login');
    }
      console.log(UserContext)

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
        // console.log("this is the job description: ", jobValue)
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
        const response = await fetch("http://localhost:8000/completions", options)
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
        let data = await openAiReq(prompt, val)
        if(data && data.choices && data.choices.length > 0){
            await updateVals(data, val)
        } else {
            console.error('Invalid data received', data);
        }
        }
    }

    const updateVals = async (data, valueupdate) => {
        if (valueupdate === "resume") {
            setOptimizedResume(data.choices[0].message.content.replace(/\n/g, "<br>"));
        }else if (valueupdate === "summary") {
            setJobSummary(data.choices[0].message.content);
        } else if (valueupdate === "coverLetter") {
            setOptimizedCover(data.choices[0].message.content.replace(/\n/g, "<br>"));
        } else if (valueupdate === "jobFit") {
            setAssessment(data.choices[0].message.content.replace(/\n/g, "<br>"));
        }
        }
        
    const sendDataToServer = async () => {
        const document = {
        optimizedResume: optimizedResume,
        optimizedCover: optimizedCover,
        assessment: assessment,
        summary: jobSummary,
        date: new Date(),
        }
        try {
        const response = await fetch('http://127.0.0.1:8000/historyPost', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(document),
        })
        if (!response.ok) {
            throw new Error(`HTTP error sending data to server! \n **************************\nstatus: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data sent to server:', data)
        } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        }
    }

    useEffect(() => {
        try{
        const fetchHistory = async () => {
        const response = await fetch("http://localhost:8000/historyGet");
        const data = await response.json();
        setHistoryData(data);
        }
        fetchHistory();
        }catch (error) {
        console.log(error)
        alert("OH NO! we couldn't get the history from the server.")
        }
    }, []);

    // console.log(historyData)
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
                setOptimizedResume(item.optimizedResume);
                setOptimizedCover(item.optimizedCover);
                setAssessment(item.assessment);
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
            <>
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
                    await Promise.allSettled([getCompletions()]);
                    await sendDataToServer();
                    setView('resume')
                    alert("Your application docs are ready!")
                }}>Generate Assistance on Application!</button>
                </div>
            </>
            )}
            {view === 'resume' && (
            <>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='displayArea'>
                <p>Optimized Resume:</p>
                <p dangerouslySetInnerHTML={{__html: optimizedResume}} />
                </div>
                <div className='bottomButtons'>
                <button onClick={() => window.location.reload()}>Reload</button>
                </div>
            </>
            )}
            {view === 'coverLetter' && (
            <>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='displayArea'>
                <p>Optimized Cover Letter: </p>
                <p dangerouslySetInnerHTML={{__html: optimizedCover}} />
                </div>
            <div className='bottomButtons'>
                <button onClick={() => window.location.reload()}>Reload</button>
            </div>
            </>
            )}
            {view === 'jobFit' && (
            <>
                <div className='navBarTop'>
                <button onClick={() => setView('resume')}>View Resume</button> <br></br>
                <button onClick={() => setView('coverLetter')}>View cover letter</button> <br></br>
                <button onClick={() => setView('jobFit')}>View Assessment</button>
                </div>
                <div className='displayArea'>
                <p> Assessment: </p>
                <p dangerouslySetInnerHTML={{__html: assessment}} />
                </div>
                <div className='bottomButtons'>
                <button onClick={() => window.location.reload()}>Reload</button>
                </div>
            </>
            )}
        </section>
        </div>
    );
}

export default Main;