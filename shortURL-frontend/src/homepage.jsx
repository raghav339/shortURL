import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import './App.css';

export default function Homepage()
{
    const [orgURL,setOrgURL]=useState("");
    const [shortURL,setShortURL]=useState("");
    const [urls,setUrls]=useState([]);
    const [expireTime,setExpireTime]=useState("");
    const [message,setMessage]=useState("");
    const [timeRemain,setTimeRemain]=useState([]);

    useEffect(() => {
        async function fetchURLs() {
            const res = await fetch("http://localhost:3000", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            const content = await res.json();

            setMessage(content.message);

            if (content.message === "SUCCESS") {
                setUrls(content.urls);
            }
        }

        fetchURLs();
    }, []);

    useEffect(() => {
        if (urls.length === 0) return;

        const interval = setInterval(() => {
            const now = new Date();

            setUrls(current => {
                const remaining = current.filter(
                    url => new Date(url.expireAt) > now
                );

                setTimeRemain(
                    remaining.map(url => {
                        const diff = new Date(url.expireAt) - now;
                        return Math.floor(diff / 1000);
                    })
                );

                return remaining;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [urls]);

    async function addURL()
    {
        const res=await fetch("http://localhost:3000",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":localStorage.getItem("token")
            },
            body:JSON.stringify({
                shortURL,orgURL,expireTime
            })
        })
        const content=await res.json();
        setMessage(content.message);
        if(content.message==="SUCCESS")
        {
            setUrls([
                ...urls,
                content.url
            ])

            setShortURL("");
            setOrgURL("");
            setExpireTime(0);
        }
    }

    async function deleteURL(id)
    {
        const res=await fetch("http://localhost:3000",{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":localStorage.getItem("token")
            },
            body:JSON.stringify({id})
        })
        const content=await res.json();
        setMessage(content.message);
        if(content.message==="SUCCESS")
            setUrls(urls.filter((url)=> url._id!==id));
    }

    function increaseCheck(id)
    {
        setUrls(urls.map(url =>
            url._id === id
                ? { ...url, checks: url.checks + 1 }
                : url
        ));
    }

    return (
        <>
            <h1 style={{textAlign:"center"}}>SHORT URLS!</h1>
            <div style={{display:"flex",justifyContent: "center",gap: "20px",marginBottom:"50px"}}>
              <Link to="/signin">Signin</Link>
              <Link to="/signup">Signup</Link>
              <Link to="/logout">Logout</Link>
            </div>
            <div style={{display:"flex",gap:"30px"}}>
                <input placeholder="Enter Original URL" value={orgURL} onChange={(e)=>setOrgURL(e.target.value)} />
                <input placeholder="Enter short URL" value={shortURL} onChange={(e)=>setShortURL(e.target.value)} />
                <input placeholder="Enter Expire Time " value={expireTime} onChange={(e)=>setExpireTime(Number(e.target.value))} />
                <button onClick={addURL}>ADD URL</button>
            </div>
            {(message!=="SUCCESS" && message!=="")&&(
                <h2 style={{textAlign:"center"}}>{message}</h2>
            )}

            <div className="table">
                <div className="header">Original URL</div>
                <div className="header">Short URL</div>
                <div className="header">Checks</div>
                <div className="header">Time remaining</div>

                {urls.map((url,i)=>{
                    return(
                    <div key={url._id} style={{display:"contents"}}>
                        <a href={url.orgURL} target="_blank" rel="noopener noreferrer">{url.orgURL}</a>
                        <a href={url.shortURL} onClick={()=>increaseCheck(url._id)} target="_blank" rel="noopener noreferrer">{url.shortURL}</a>
                        <div>{url.checks}</div>
                        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                            <div>{timeRemain[i]}</div>
                            <button onClick={()=>deleteURL(url._id)}>Delete</button>
                        </div>
                    </div>
                    )
                })}
            </div>
        </>
    )

}