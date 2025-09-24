import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); 
    const [role, setRole] = useState("buyer");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setErrorMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/user/register/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    confirm_password: confirmPassword,
                    email,
                    phone: phone,
                    role,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setErrorMessage(data.detail || JSON.stringify(data));
                return;
            }

            navigate("/login");
        } catch (error) {
            setErrorMessage("An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Corrected container for better positioning
        <div className='relative flex items-center justify-center min-h-screen py-20 bg-cover bg-center' style={{backgroundImage: "url(/assets/Images/home.jpg)"}}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            {/* Removed mt-36 class */}
            <form onSubmit={handleSubmit} className="z-10 w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                {/* Close/Cancel Button */}
                <Link to="/" className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>

                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                {errorMessage && (
                    <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
                )}
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Phone " 
                />
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value='buyer'>Buyer</option>
                    <option value="farmer">Farmer</option>
                </select>
                <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <p className="p-8 text-center font-semibold">
                    Already Registered? <span className="text-blue-500"><Link to='/login'>Login</Link></span>
                </p>
            </form>
        </div>
    );
}

export default Register;