// // ✅ NEW FILE (or updated file): src/components/UserLogin.jsx
// // This is your login page component that will show up when you run `npm run dev`.

// import React, { useState } from "react";

// export default function UserLogin() {
//   // ✅ State for form data
//   const [email, setEmail] = useState("");
//   const [pwd, setPwd] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   // ✅ Simple validation before submit
//   const validate = () => {
//     const e = {};
//     if (!email) e.email = "Email is required";
//     if (!pwd) e.pwd = "Password is required";
//     return e;
//   };

//   // ✅ Handle form submit
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const v = validate();
//     setErrors(v);
//     if (Object.keys(v).length) return;

//     try {
//       setSubmitting(true);
//       // TODO: replace this with your real login API call
//       console.log("Logging in with", { email, pwd });
//       alert("Pretend login success!");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="login-wrap">
//       <div className="login-card">
//         <h1 className="login-title">Log in</h1>

//         <form onSubmit={onSubmit} className="login-form" noValidate>
//           <label>
//             Email
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             {errors.email && (
//               <span className="field-error">{errors.email}</span>
//             )}
//           </label>

//           <label>
//             Password
//             <div className="pwd-row">
//               <input
//                 type={showPwd ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={pwd}
//                 onChange={(e) => setPwd(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="ghost-btn"
//                 onClick={() => setShowPwd((s) => !s)}
//               >
//                 {showPwd ? "Hide" : "Show"}
//               </button>
//             </div>
//             {errors.pwd && <span className="field-error">{errors.pwd}</span>}
//           </label>

//           <button
//             type="submit"
//             className="login-btn"
//             disabled={submitting || !email || !pwd}
//           >
//             {submitting ? "Logging in..." : "Log in"}
//           </button>
//         </form>

//         <div className="login-links">
//           <a href="#">Forgot password?</a>
//           <a href="#">Create account</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/UserLogin.jsx
import React, { useState } from "react";

export default function UserLogin() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: hook to your auth
    console.log({ username, pwd });
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <h1 className="login-heading">
          <span className="login-heading-shadow">log in</span>
          <span className="login-heading-fill">log in</span>
        </h1>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-row">
            <label className="login-label" htmlFor="user">
              Username :
            </label>
            <input
              id="user"
              className="login-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
          </div>

          <div className="login-row">
            <label className="login-label" htmlFor="pass">
              Password :
            </label>
            <input
              id="pass"
              className="login-input"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              aria-label="Password"
            />
          </div>

          <button className="login-submit" type="submit">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
