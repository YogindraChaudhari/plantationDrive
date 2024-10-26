// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import bgImage from "../assets/backgroundImage.jpg";

// const AuthScreen = () => {
//   const { login, register } = useAuth();
//   const navigate = useNavigate();
//   const [isRegister, setIsRegister] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [error, setError] = useState("");

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     try {
//       if (isRegister) {
//         await register(email, password);
//         navigate("/");
//       } else {
//         await login(email, password);
//         navigate("/");
//       }
//     } catch (error) {
//       setError(error.message); // Set the error message
//       console.error("Authentication Error:", error.message);
//     }
//   };
//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-gray-100"
//       style={{
//         backgroundImage: `url(${bgImage})`,
//         opacity: 0.9,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white mt-10 opacity-90">
//         <h2 className="text-2xl font-semibold mb-4 text-center">
//           {isRegister ? "Register" : "Login"}
//         </h2>
//         <form onSubmit={handleAuth} className="space-y-4">
//           {isRegister && (
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           )}
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             type="submit"
//             className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             {isRegister ? "Register" : "Login"}
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsRegister(!isRegister)}
//             className="w-full p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
//           >
//             {isRegister ? "Switch to Login" : "Switch to Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AuthScreen;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import bgImage from "../assets/backgroundImage.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthScreen = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(email, password, username); // Pass username during registration
        toast.success("Registration successful!");
        navigate("/");
      } else {
        await login(email, password);
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
      console.error("Authentication Error:", error.message);
      toast.error("Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${bgImage})`,
        opacity: 0.9,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto p-8 border rounded-lg shadow-lg bg-white mt-10 opacity-95">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isRegister ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-600" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 pl-10 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-600" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 pl-10 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pl-10 pr-12 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-900"
              style={{ background: "transparent", border: "none" }}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isRegister ? "Register" : "Login"}
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="w-full p-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {isRegister ? "Switch to Login" : "Switch to Register"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthScreen;
