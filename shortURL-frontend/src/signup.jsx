import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup()
{
    const [username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const [message,setMessage]=useState("");
    const navigate=useNavigate();
    async function sign(){
        const res=await fetch("http://localhost:3000/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,password
            })
        })
        const content=await res.json();
        setMessage(content.message);
        if(content.message==="SUCCESS")
        {
            setUsername("");
            setPassword("");
            navigate("/signin");
        }
    }
    return(
        <>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h1><u>SIGN UP!</u></h1>
                <h2>Username: <input style={{width:"200px"}} placeholder="Enter Username" value={username} onChange={(e)=>setUsername(e.target.value)}/></h2>
                <h2>Password: <input style={{width:"200px"}} type="password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)}/></h2>
                <button style={{width:"100px"}} onClick={sign}>Signup</button>
                <p>{message}</p>
            </div>
        </>
    );
}