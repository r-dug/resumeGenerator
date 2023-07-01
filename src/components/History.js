import { useState } from "react"
import setOptimizedResume from "./display/Resume"
import setOptimizedCover from "./display/CoverLetter"
import setAssessment from "./display/JobFit"
const History = () => {
    const API_URL = process.env.REACT_APP_API_URL || 'https://localhost';
    const [historyData, setHistoryData] = useState([])

    useEffect(() => {
        const fetchHistory = async () => {
          const response = await fetch(`${API_URL}/historyGet`);
          const data = await response.json();
          setHistoryData(data);
        }
        fetchHistory();
      }, []);
    return (
        <ul className="history">
        {historyData.map((item, index) => (
            <li key={index} onClick={() => {
            setOptimizedResume(item.optimizedResume);
            setOptimizedCover(item.optimizedCover);
            setAssessment(item.assessment);
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

    );
}
export default History