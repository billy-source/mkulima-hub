import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; 
 
function Login({ setIsLoggedIn }) {const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
 
    const handleSubmit = async (e) => { 
        setLoading(true); 
        e.preventDefault(); 
 
        try { 
            const res = await fetch("http://127.0.0.1:8000/api/token/", { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                },  
                body: JSON.stringify({ username, password }), 
            }); 
            if (!res.ok)  
                throw new Error('Network response was not okay'); 
                const data = await res.json(); 
 
            // Store tokens in localStorage 
            localStorage.setItem(ACCESS_TOKEN, data.access); 
            localStorage.setItem(REFRESH_TOKEN, data.refresh); 
            localStorage.setItem('role', data.role); 
             
            setIsLoggedIn(true); 
            navigate("/"); // Navigate to home after successful login 
        } catch (error) { 
            alert(error.message || "An error occurred during login."); 
        } finally { 
            setLoading(false); 
        } 
    };  return ( 
        <div className='relative flex items-center justify-center h-screen 
bg-cover bg-center' style={{backgroundImage: 
"url(/assets/Images/home.jpg)"}}> 
            <div className="absolute inset-0 bg-black opacity-50"></div> 
        <form onSubmit={handleSubmit} className="z-10 max-w-md 
mx-auto bg-white p-8 rounded-lg shadow-lg mt-36"> 
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1> 
            <input 
                className="w-full p-3 mb-4 border border-gray-300 rounded 
focus:outline-none focus:border-blue-500" 
                type="text" value={username} onChange={(e) => 
setUsername(e.target.value)} placeholder="Username" 
            /> 
            <input 
                className="w-full p-3 mb-4 border border-gray-300 rounded 
focus:outline-none focus:border-blue-500" 
                type="password" value={password} onChange={(e) => 
setPassword(e.target.value)}  placeholder="Password" /> 
            <p className="p-8 font-semibold"> 
                Not Registered? <span className="text-blue-500"><Link 
to='/register'>Register</Link></span> 
            </p> 
            <button 
                className="w-full bg-blue-500 text-white py-3 rounded-lg 
hover:bg-blue-600 transition duration-300" 
                type="submit" 
                disabled={loading} 
            > 
                {loading ? "Logging in..." : "Login"} 
            </button> 
        </form> 
        </div> 
    ); 
}
export default Login;