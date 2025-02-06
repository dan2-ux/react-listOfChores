import {useState, useEffect , useRef} from 'react'
import Alarm from './assets/AlarmSound.mp3'

function kkk(){
    const [data, sData] = useState([]);
    const [date, sDate] = useState("")
    const [time,sTime] = useState("")
    const [input, sInput] = useState("")
    const ring = useRef(new Audio(Alarm))
    function doAdd(){
        if(input !== "" && date !== "" && time !== ""){
            sData((d) => [...d, [input, date, time]]);
            console.log(data)
            sInput("")
            sDate("")
            sTime("")
        }
        else{

        }
    }
    
    return(
        <div className='box'>
            <h1>Set schedule</h1>
            <div className='enter'>
                <input type="text" value={input} onChange={(e) => sInput(e.target.value)} />
                <input type="date" value={date} onChange={(e) => sDate(e.target.value)}/>
                <input type="time" value={time} onChange={(e) => sTime(e.target.value)}/>
            </div>
            <button className='set' onClick={doAdd}>Set Remider</button>
            <div className='dis'>
                {data.map((element,i) => (
                    <ScheduleItem key={i} value={element} index={i} sData={sData}
                    data={data} ring={ring}/>
                ))}
            </div>
        </div>
    )
}
function ScheduleItem({ value  , index , sData , data , ring}){
    const scheduleDate = new Date(`${value[1]}T${value[2]}`);
    const [dis, sDis] = useState(scheduleDate - Date.now())
    
    useEffect(() => {
        if(dis > 1){
            const inter = setInterval(() =>{
                sDis(scheduleDate - Date.now())
                
            } , 1000)
            return () => {
                clearInterval(inter)
            }
        }
        else{
            sDis(0);
            ring.current.play()
        }
    }, [dis])
    
    const secs = String(Math.floor(dis / 1000 % 60)).padStart(2,0)
    const mins = String(Math.floor(dis / (1000 * 60) % 60)).padStart(2,0)
    const hours = String(Math.floor( dis / (1000 * 60 * 60) % 24)).padStart(2,0)
    const days = String(Math.floor( dis / (1000 * 60 * 60 * 24 ))).padStart(2,0)
    function doUp(value,index){
        if(index > 0){
            const newData = [...data];
            [newData[index] , newData[index - 1]] = [newData[index - 1], newData[index]];
            sData(newData)
        }
    }
    function doDown(value, index){
        if(index < data.length - 1 ){
            const newData = [...data];
            [newData[index] , newData[index + 1]] =
            [newData[index + 1] , newData[index]];
            sData(newData);
        }
    }
    function doDel(value, index){
        sData(prevData => prevData.filter((_, i) => i !== index));
    }
    return(
        <div className='overBox'>
            <div className='innerBox'>
                <span>{value[0]}</span>
                <span>{value[1]} {value[2]}</span>
                <div id='button'> 
                    <div id='buttont'>
                        <button title='Move Chore Up' id='xbutton' onClick={() => doUp(value,index)}>☝️</button>
                        <button title='Move Chore Down' id='xbutton' onClick={() => doDown(value, index)}>👇</button>
                    </div>
                    <button title='Delete Chore' id='xbutton' onClick={() => doDel(value,index)}>😇</button>
                </div>
            </div>
            {dis === 0 ?
                <button onClick={() => {
                    ring.current.pause()
                }}>Turn Alarm Off</button>
                :
                <table>
                    <tr>
                        <th>Day</th>
                        <th>Hour</th>
                        <th>Min</th>
                        <th>Sec</th>
                    </tr>
                    <tr>
                        <td>{days}</td>
                        <td>{hours}</td>
                        <td>{mins}</td>
                        <td>{secs}</td>
                    </tr>
                </table>
            }
            
            
        </div>
    )
}
export default kkk