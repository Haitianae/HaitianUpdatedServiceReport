// //Firebase code
// import React, { useState, useEffect } from "react";
// import HaitianLogo from "../Images/HaitianLogo.png";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import HaitianBackgroundImage from "../Images/HaitianBanner.png";
// import { Button, Form, Input, notification } from "antd";
// import { loginUser } from "../Firebase/authService";
// import "../App.css";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
// });

// export default function Login({ onLoginSuccess }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [shake, setShake] = useState(false);
//   const [initialAnimation, setInitialAnimation] = useState(true);

//   // ============================================================
//   // SHAKE ANIMATION
//   // ============================================================

//   useEffect(() => {
//     if (shake) {
//       const timer = setTimeout(() => {
//         setShake(false);
//       }, 400);

//       return () => clearTimeout(timer);
//     }
//   }, [shake]);

//   // ============================================================
//   // INITIAL FADE-IN ANIMATION
//   // ============================================================

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setInitialAnimation(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   // ============================================================
//   // FIREBASE LOGIN
//   // ============================================================

//   const handleSubmit = async (values) => {
//     // ----------------------------------------------------------
//     // INTERNET CHECK
//     // ----------------------------------------------------------

//     if (!navigator.onLine) {
//       notification.error({
//         message: "No Internet Connection",
//         description: "Please check your internet and try again.",
//       });

//       return;
//     }

//     setLoading(true);

//     try {
//       // --------------------------------------------------------
//       // FIREBASE AUTHENTICATION
//       // --------------------------------------------------------

//       const firebaseUser = await loginUser(
//         values.userEmail,
//         values.password
//       );

//       // --------------------------------------------------------
//       // SUCCESS NOTIFICATION
//       // --------------------------------------------------------

//       notification.success({
//         message: "Success",
//         description: `Welcome ${
//           firebaseUser.email?.split("@")[0] || "User"
//         }!`,
//       });

//       // --------------------------------------------------------
//       // SEND USER INFORMATION TO PARENT
//       // --------------------------------------------------------

//       onLoginSuccess({
//         email: firebaseUser.email,
//         access: "user",
//         uid: firebaseUser.uid,
//       });

//     } catch (error) {
//       console.error("Firebase login error:", error);

//       // --------------------------------------------------------
//       // SHAKE LOGIN BOX
//       // --------------------------------------------------------

//       setShake(true);

//       // --------------------------------------------------------
//       // FIREBASE ERROR MESSAGE
//       // --------------------------------------------------------

//       let message =
//         "Login failed. Please check your email and password.";

//       switch (error?.code) {
//         case "auth/invalid-credential":
//           message = "Invalid email or password.";
//           break;

//         case "auth/invalid-email":
//           message = "Please enter a valid email address.";
//           break;

//         case "auth/user-disabled":
//           message = "This account has been disabled.";
//           break;

//         case "auth/too-many-requests":
//           message =
//             "Too many unsuccessful attempts. Please try again later.";
//           break;

//         case "auth/network-request-failed":
//           message =
//             "Network error. Please check your internet connection.";
//           break;

//         case "auth/user-not-found":
//           message = "Invalid email or password.";
//           break;

//         case "auth/wrong-password":
//           message = "Invalid email or password.";
//           break;

//         default:
//           message =
//             error?.message ||
//             "Login failed. Please check your email and password.";
//           break;
//       }

//       notification.error({
//         message: "Login Failed",
//         description: message,
//       });

//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============================================================
//   // LOGIN PAGE CUSTOM CSS
//   // ============================================================

//   const styl = `
//     .ant-form-item .ant-form-item-label > label {
//       position: relative;
//       display: inline-flex;
//       align-items: center;
//       max-width: 100%;
//       height: 32px;
//       color: #0D3884;
//       font-size: 16px;
//     }

//     .ant-form-item .ant-form-item-explain-error {
//       color: #ff4d4f;
//       font-weight: normal !important;
//     }

//     .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
//       transition: none;
//       pointer-events: none;
//       font-weight: normal;
//     }

//     @keyframes shake {
//       0% {
//         transform: translateX(0);
//       }

//       20% {
//         transform: translateX(-15px);
//       }

//       40% {
//         transform: translateX(15px);
//       }

//       60% {
//         transform: translateX(-10px);
//       }

//       80% {
//         transform: translateX(10px);
//       }

//       100% {
//         transform: translateX(0);
//       }
//     }

//     .shake {
//       animation: shake 0.4s ease-in-out;
//     }
//   `;

//   // ============================================================
//   // UI
//   // ============================================================

//   return (
//     <>
//       <style>{styl}</style>

//       <div
//         className="container-fluid d-flex justify-content-center align-items-center vh-100 m-0 p-0"
//         style={{
//           backgroundImage: `url(${HaitianBackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div
//           className="container-fluid m-auto d-flex justify-content-center align-items-center vh-100"
//           style={{
//             backgroundColor: "rgba(0, 49, 91, 0.1)",
//           }}
//         >
//           <div className="m-auto">

//             <div
//               className={`container rounded-5 p-4 p-lg-5 loginContainer bg-white
//                 ${initialAnimation ? "fade-in" : ""}
//                 ${shake ? "shake" : ""}
//               `}
//             >

//               <div className="row">

//                 <div className="col-12">

//                   {/* ==================================================
//                       HAITIAN LOGO
//                   ================================================== */}

//                   <div className="m-auto d-flex justify-content-center align-items-center m-0 p-0">
//                     <img
//                       src={HaitianLogo}
//                       className="m-0 p-0"
//                       alt="Haitian Logo"
//                       style={{ width: "60%" }}
//                     />
//                   </div>

//                   {/* ==================================================
//                       TITLE
//                   ================================================== */}

//                   <div>

//                     <h4
//                       className="text-center haitianColor m-0 p-0"
//                       style={{ fontWeight: "600" }}
//                     >
//                       Haitian Service Report
//                     </h4>

//                     <p className="text-center text-muted">
//                       Please log in to your account
//                     </p>

//                     {/* ==================================================
//                         LOGIN FORM
//                     ================================================== */}

//                     <Form
//                       form={form}
//                       layout="vertical"
//                       className="mt-4"
//                       onFinish={handleSubmit}
//                     >

//                       {/* ==================================================
//                           EMAIL
//                       ================================================== */}

//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faCircleUser}
//                               className="me-1"
//                               size="lg"
//                             /> */}

//                             User Email
//                           </>
//                         }
//                         name="userEmail"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your email!",
//                           },
//                           {
//                             type: "email",
//                             message:
//                               "Please enter a valid email address!",
//                           },
//                         ]}
//                       >
//                         <Input size="large" />
//                       </Form.Item>

//                       {/* ==================================================
//                           PASSWORD
//                       ================================================== */}

//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faLock}
//                               className="me-1"
//                               size="lg"
//                             /> */}

//                             Password
//                           </>
//                         }
//                         name="password"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your password!",
//                           },
//                         ]}
//                       >
//                         <Input.Password size="large" />
//                       </Form.Item>

//                       {/* ==================================================
//                           LOGIN BUTTON
//                       ================================================== */}

//                       <Button
//                         className="loginButton mt-3 mb-4"
//                         size="large"
//                         htmlType="submit"
//                         loading={loading}
//                       >
//                         {loading ? "Logging In" : "Login"}
//                       </Button>

//                       {/* ==================================================
//                           COPYRIGHT
//                       ================================================== */}

//                       <p className="text-center m-0 p-0 haitianColor">
//                         © 2026 Haitian Middle East & Africa. All rights
//                         reserved.
//                       </p>

//                     </Form>

//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useState, useEffect } from "react";
// import HaitianLogo from "../Images/HaitianLogo.png";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import HaitianBackgroundImage from "../Images/HaitianBanner.png";
// import { Button, Form, Input, notification } from "antd";
// import "../App.css";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
// });

// export default function Login({ onLoginSuccess }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [shake, setShake] = useState(false);
//   const [initialAnimation, setInitialAnimation] = useState(true);

//   useEffect(() => {
//     if (shake) {
//       const timer = setTimeout(() => {
//         setShake(false);
//       }, 400); // match animation duration
//       return () => clearTimeout(timer);
//     }
//   }, [shake]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setInitialAnimation(false); // disable fade-in after first render
//     }, 800); // match fade-in duration

//     return () => clearTimeout(timer);
//   }, []);

//   const handleSubmit = async (values) => {
//     if (!navigator.onLine) {
//       notification.error({
//         message: "No Internet Connection",
//         description: "Please check your internet and try again.",
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://script.google.com/macros/s/AKfycbw0p26TCsCq-VRg2EF5a6geQUQ-rty80_yabTCgYYBcq3-RFTUs_1UXf46NVuPZ2D5d/exec",
//         {
//           method: "POST",
//           body: new URLSearchParams({
//             action: "loginUser",
//             userEmail: values.userEmail,
//             password: values.password,
//           }),
//         },
//       );

//       const data = await response.json();
//       if (data.success) {
//         notification.success({
//           message: "Success",
//           // description: `Login successful!`,
//           description: `Welcome ${values.userEmail.split("@")[0]}!`,
//         });

//         // onLoginSuccess(values.username);
//         onLoginSuccess({
//           email: values.userEmail,
//           access: data.access,
//         });
//       } else {
//         setShake(true);
//         notification.error({
//           message: "Error",
//           description: "Login failed: " + data.message,
//         });
//       }
//     } catch (error) {
//       notification.error({
//         message: "Error",
//         description: "Error: " + error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styl = `.ant-form-item .ant-form-item-label >label {
//     position: relative;
//     display: inline-flex
// ;
//     align-items: center;
//     max-width: 100%;
//     height: 32px;
//     color: #0D3884;
//     font-size: 16px;
// }
// .ant-form-item .ant-form-item-explain-error {
//     color: #ff4d4f;
//     font-weight: normal !important;
// }

//      .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
//     transition: none;
//     pointer-events: none;
//     font-weight: normal;
// }
//     @keyframes shake {
//     0% { transform: translateX(0); }
//     20% { transform: translateX(-15px); }
//     40% { transform: translateX(15px); }
//     60% { transform: translateX(-10px); }
//     80% { transform: translateX(10px); }
//     100% { transform: translateX(0); }
//   }

//   .shake {
//     animation: shake 0.4s ease-in-out;
//   }
// `;

//   return (
//     <>
//       <style>{styl}</style>

//       <div
//         className="container-fluid  d-flex justify-content-center align-items-center vh-100 m-0 p-0"
//         style={{
//           backgroundImage: `url(${HaitianBackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div
//           className="container-fluid m-auto  d-flex justify-content-center align-items-center vh-100"
//           style={{
//             backgroundColor: "rgba(0, 49, 91, 0.1)",
//           }}
//         >
//           <div className=" m-auto ">
//             <div
//               // className={`container rounded-5 p-5 loginContainer bg-white fade-in ${
//               //   shake ? "shake" : ""
//               // }`}
//               className={`container rounded-5 p-4 p-lg-5 loginContainer bg-white
//     ${initialAnimation ? "fade-in" : ""}
//     ${shake ? "shake" : ""}
//   `}
//             >
//               <div className="row">
//                 <div className="col-12">
//                   <div className="m-auto d-flex justify-content-center align-items-center m-0 p-0 ">
//                     <img
//                       src={HaitianLogo}
//                       className="m-0 p-0"
//                       alt="Haitian Logo"
//                       style={{ width: "60%" }}
//                     />
//                   </div>
//                   <div>
//                     <h4
//                       className="text-center haitianColor m-0 p-0"
//                       style={{ fontWeight: "600" }}
//                     >
//                       Haitian Service Report
//                     </h4>
//                     <p className="text-center text-muted">
//                       Please log in to your account
//                     </p>
//                     <Form
//                       form={form}
//                       layout="vertical"
//                       className="mt-4"
//                       onFinish={handleSubmit}
//                     >
//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faCircleUser}
//                               className="me-1"
//                               size="lg"
//                             /> */}
//                             User Email
//                           </>
//                         }
//                         name="userEmail"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your email!",
//                           },
//                           {
//                             type: "email",
//                             message: "Please enter a valid email address!",
//                           },
//                         ]}
//                       >
//                         <Input size="large" />
//                       </Form.Item>

//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faLock}
//                               className="me-1"
//                               size="lg"
//                             /> */}
//                             Password
//                           </>
//                         }
//                         name="password"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your password!",
//                           },
//                         ]}
//                       >
//                         <Input.Password size="large" />
//                       </Form.Item>
//                       <Button
//                         className="loginButton mt-3 mb-4"
//                         size="large"
//                         htmlType="submit"
//                         loading={loading}
//                       >
//                         {loading ? "Logging In" : "Login"}
//                       </Button>
//                       <p className="text-center m-0 p-0 haitianColor">
//                         © 2026 Haitian Middle East & Africa. All rights reserved.
//                       </p>
//                     </Form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useState, useEffect } from "react";
// import HaitianLogo from "../Images/HaitianLogo.png";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import HaitianBackgroundImage from "../Images/HaitianBanner.png";
// import { Button, Form, Input, notification } from "antd";
// import "../App.css";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
// });

// export default function Login({ onLoginSuccess }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [shake, setShake] = useState(false);
//   const [initialAnimation, setInitialAnimation] = useState(true);

//   useEffect(() => {
//     if (shake) {
//       const timer = setTimeout(() => {
//         setShake(false);
//       }, 400); // match animation duration
//       return () => clearTimeout(timer);
//     }
//   }, [shake]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setInitialAnimation(false); // disable fade-in after first render
//     }, 800); // match fade-in duration

//     return () => clearTimeout(timer);
//   }, []);

//   const handleSubmit = async (values) => {
//     if (!navigator.onLine) {
//       notification.error({
//         message: "No Internet Connection",
//         description: "Please check your internet and try again.",
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const controller = new AbortController();
//       const timeoutId = window.setTimeout(() => controller.abort(), 20000);

//       let response;

//       try {
//         response = await fetch(
//           "https://script.google.com/macros/s/AKfycbyJNeVChjLeGilxPzpRABaWlhEkIscvgnsy5F88wF-xjLVGdRoxdb6jur3sPyxaf0qFGg/exec",
//           {
//             method: "POST",
//             body: new URLSearchParams({
//               action: "loginUser",
//               userEmail: values.userEmail.trim(),
//               password: values.password,
//             }),
//             signal: controller.signal,
//           },
//         );
//       } finally {
//         window.clearTimeout(timeoutId);
//       }

//       const data = await response.json();
//       if (data.success) {
//         notification.success({
//           message: "Success",
//           // description: `Login successful!`,
//           description: `Welcome ${values.userEmail.split("@")[0]}!`,
//         });

//         // onLoginSuccess(values.username);
//         onLoginSuccess({
//           email: values.userEmail,
//           access: data.access,
//         });
//       } else {
//         setShake(true);
//         notification.error({
//           message: "Error",
//           description: "Login failed: " + data.message,
//         });
//       }
//     } catch (error) {
//       notification.error({
//         message: "Error",
//         description:
//           error?.name === "AbortError"
//             ? "Login request timed out. Please try again."
//             : "Error: " + (error?.message || "Unable to login."),
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styl = `.ant-form-item .ant-form-item-label >label {
//     position: relative;
//     display: inline-flex
// ;
//     align-items: center;
//     max-width: 100%;
//     height: 32px;
//     color: #0D3884;
//     font-size: 16px;
// }
// .ant-form-item .ant-form-item-explain-error {
//     color: #ff4d4f;
//     font-weight: normal !important;
// }

//      .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
//     transition: none;
//     pointer-events: none;
//     font-weight: normal;
// }
//     @keyframes shake {
//     0% { transform: translateX(0); }
//     20% { transform: translateX(-15px); }
//     40% { transform: translateX(15px); }
//     60% { transform: translateX(-10px); }
//     80% { transform: translateX(10px); }
//     100% { transform: translateX(0); }
//   }

//   .shake {
//     animation: shake 0.4s ease-in-out;
//   }
// `;

//   return (
//     <>
//       <style>{styl}</style>

//       <div
//         className="container-fluid  d-flex justify-content-center align-items-center vh-100 m-0 p-0"
//         style={{
//           backgroundImage: `url(${HaitianBackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div
//           className="container-fluid m-auto  d-flex justify-content-center align-items-center vh-100"
//           style={{
//             backgroundColor: "rgba(0, 49, 91, 0.1)",
//           }}
//         >
//           <div className=" m-auto ">
//             <div
//               // className={`container rounded-5 p-5 loginContainer bg-white fade-in ${
//               //   shake ? "shake" : ""
//               // }`}
//               className={`container rounded-5 p-4 p-lg-5 loginContainer bg-white
//     ${initialAnimation ? "fade-in" : ""}
//     ${shake ? "shake" : ""}
//   `}
//             >
//               <div className="row">
//                 <div className="col-12">
//                   <div className="m-auto d-flex justify-content-center align-items-center m-0 p-0 ">
//                     <img
//                       src={HaitianLogo}
//                       className="m-0 p-0"
//                       alt="Haitian Logo"
//                       style={{ width: "60%" }}
//                     />
//                   </div>
//                   <div>
//                     <h4
//                       className="text-center haitianColor m-0 p-0"
//                       style={{ fontWeight: "600" }}
//                     >
//                       Haitian Service Report
//                     </h4>
//                     <p className="text-center text-muted">
//                       Please log in to your account
//                     </p>
//                     <Form
//                       form={form}
//                       layout="vertical"
//                       className="mt-4"
//                       onFinish={handleSubmit}
//                     >
//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faCircleUser}
//                               className="me-1"
//                               size="lg"
//                             /> */}
//                             User Email
//                           </>
//                         }
//                         name="userEmail"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your email!",
//                           },
//                           {
//                             type: "email",
//                             message: "Please enter a valid email address!",
//                           },
//                         ]}
//                       >
//                         <Input size="large" />
//                       </Form.Item>

//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faLock}
//                               className="me-1"
//                               size="lg"
//                             /> */}
//                             Password
//                           </>
//                         }
//                         name="password"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your password!",
//                           },
//                         ]}
//                       >
//                         <Input.Password size="large" />
//                       </Form.Item>
//                       <Button
//                         className="loginButton mt-3 mb-4"
//                         size="large"
//                         htmlType="submit"
//                         loading={loading}
//                       >
//                         {loading ? "Logging In" : "Login"}
//                       </Button>
//                       <p className="text-center m-0 p-0 haitianColor">
//                         © 2026 Haitian Middle East & Africa. All rights reserved.
//                       </p>
//                     </Form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useState, useEffect } from "react";
// import HaitianLogo from "../Images/HaitianLogo.png";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import HaitianBackgroundImage from "../Images/HaitianBanner.png";
// import { Button, Form, Input, notification } from "antd";
// import "../App.css";

// notification.config({
//   maxCount: 2,
//   placement: "bottomRight",
//   duration: 3,
// });

// export default function Login({ onLoginSuccess }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [shake, setShake] = useState(false);
//   const [initialAnimation, setInitialAnimation] = useState(true);

//   useEffect(() => {
//     if (shake) {
//       const timer = setTimeout(() => {
//         setShake(false);
//       }, 400); // match animation duration
//       return () => clearTimeout(timer);
//     }
//   }, [shake]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setInitialAnimation(false); // disable fade-in after first render
//     }, 800); // match fade-in duration

//     return () => clearTimeout(timer);
//   }, []);

//   const handleSubmit = async (values) => {
//     if (!navigator.onLine) {
//       notification.error({
//         message: "No Internet Connection",
//         description: "Please check your internet and try again.",
//       });
//       return;
//     }

//     setLoading(true);
//     const controller = new AbortController();
//     const timeoutId = window.setTimeout(() => controller.abort(), 20000);

//     try {
//       const response = await fetch(
//         "https://script.google.com/macros/s/AKfycby0wDLT5i7fvdm-XDwIU1XO1qxfS_sn2O_jIIq2HdLrxFgRchz4Edb3KAnX7msm6eiv7A/exec",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             action: "loginUser",
//             userEmail: String(values.userEmail || "").trim(),
//             password: String(values.password || ""),
//           }).toString(),
//           signal: controller.signal,
//         },
//       );

//       if (response.status === 404) {
//         const error = new Error(
//           "Google Apps Script Web App returned HTTP 404. The /exec deployment URL is invalid, deleted, restricted, or this frontend is using an old deployment.",
//         );
//         error.code = "GAS_DEPLOYMENT_404";
//         throw error;
//       }

//       if (!response.ok) {
//         throw new Error(`Server returned HTTP ${response.status}`);
//       }

//       const rawText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(rawText);
//       } catch {
//         throw new Error("Google Apps Script returned invalid JSON.");
//       }

//       if (data.success) {
//         notification.success({
//           message: "Success",
//           description: `Welcome ${String(values.userEmail || "").split("@")[0]}!`,
//         });

//         onLoginSuccess({
//           email: String(values.userEmail || "").trim(),
//           access: data.access,
//         });
//       } else {
//         setShake(true);
//         notification.error({
//           message: "Error",
//           description:
//             "Login failed: " + (data.message || "Invalid email or password"),
//         });
//       }
//     } catch (error) {
//       notification.error({
//         message:
//           error?.code === "GAS_DEPLOYMENT_404"
//             ? "Backend Deployment Error"
//             : "Error",
//         description:
//           error?.name === "AbortError"
//             ? "Login request timed out. Please try again."
//             : error?.message || "Unable to connect to the backend.",
//       });
//     } finally {
//       window.clearTimeout(timeoutId);
//       setLoading(false);
//     }
//   };

//   const styl = `.ant-form-item .ant-form-item-label >label {
//     position: relative;
//     display: inline-flex
// ;
//     align-items: center;
//     max-width: 100%;
//     height: 32px;
//     color: #0D3884;
//     font-size: 16px;
// }
// .ant-form-item .ant-form-item-explain-error {
//     color: #ff4d4f;
//     font-weight: normal !important;
// }    

//      .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
//     transition: none;
//     pointer-events: none;
//     font-weight: normal;
// }
//     @keyframes shake {
//     0% { transform: translateX(0); }
//     20% { transform: translateX(-15px); }
//     40% { transform: translateX(15px); }
//     60% { transform: translateX(-10px); }
//     80% { transform: translateX(10px); }
//     100% { transform: translateX(0); }
//   }

//   .shake {
//     animation: shake 0.4s ease-in-out;
//   }
// `;

//   return (
//     <>
//       <style>{styl}</style>

//       <div
//         className="container-fluid  d-flex justify-content-center align-items-center vh-100 m-0 p-0"
//         style={{
//           backgroundImage: `url(${HaitianBackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div
//           className="container-fluid m-auto  d-flex justify-content-center align-items-center vh-100"
//           style={{
//             backgroundColor: "rgba(0, 49, 91, 0.1)",
//           }}
//         >
//           <div className=" m-auto ">
//             <div
//               // className={`container rounded-5 p-5 loginContainer bg-white fade-in ${
//               //   shake ? "shake" : ""
//               // }`}
//               className={`container rounded-5 p-4 p-lg-5 loginContainer bg-white
//     ${initialAnimation ? "fade-in" : ""}
//     ${shake ? "shake" : ""}
//   `}
//             >
//               <div className="row">
//                 <div className="col-12">
//                   <div className="m-auto d-flex justify-content-center align-items-center m-0 p-0 ">
//                     <img
//                       src={HaitianLogo}
//                       className="m-0 p-0"
//                       alt="Haitian Logo"
//                       style={{ width: "60%" }}
//                     />
//                   </div>
//                   <div>
//                     <h4
//                       className="text-center haitianColor m-0 p-0"
//                       style={{ fontWeight: "600" }}
//                     >
//                       Haitian Service Report
//                     </h4>
//                     <p className="text-center text-muted">
//                       Please log in to your account
//                     </p>
//                     <Form
//                       form={form}
//                       layout="vertical"
//                       className="mt-4"
//                       onFinish={handleSubmit}
//                     >
//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faCircleUser}
//                               className="me-1"
//                               size="lg"
//                             /> */}
//                             User Email
//                           </>
//                         }
//                         name="userEmail"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your email!",
//                           },
//                           {
//                             type: "email",
//                             message: "Please enter a valid email address!",
//                           },
//                         ]}
//                       >
//                         <Input size="large" />
//                       </Form.Item>

//                       <Form.Item
//                         label={
//                           <>
//                             {/* <FontAwesomeIcon
//                               icon={faLock}
//                               className="me-1"
//                               size="lg"
//                             /> */}
//                             Password
//                           </>
//                         }
//                         name="password"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input your password!",
//                           },
//                         ]}
//                       >
//                         <Input.Password size="large" />
//                       </Form.Item>
//                       <Button
//                         className="loginButton mt-3 mb-4"
//                         size="large"
//                         htmlType="submit"
//                         loading={loading}
//                         disabled={loading}
//                       >
//                         {loading ? "Logging In" : "Login"}
//                       </Button>
//                       <p className="text-center m-0 p-0 haitianColor">
//                         © 2026 Haitian Middle East & Africa. All rights
//                         reserved.
//                       </p>
//                     </Form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import HaitianLogo from "../Images/HaitianLogoWhite.png";
import HaitianBackgroundImage from "../Images/HaitianMachine.jpg";
import { Button, Form, Input, notification } from "antd";
import "../App.css";
import "../Login.css";
import {

  EyeOutlined,
  SafetyOutlined,

} from "@ant-design/icons";

notification.config({
  maxCount: 2,
  placement: "bottomRight",
  duration: 3,
});

// Keep the existing backend endpoint and request format unchanged.
const LOGIN_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxPtFQDfu04zysazJwP5F5jiessPEZb0XaE8UYYLJ2LrVLRYXcxxOcpPW5Z4ccDABk1tA/exec";

export default function Login({ onLoginSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [initialAnimation, setInitialAnimation] = useState(true);

  useEffect(() => {
    if (!shake) return undefined;
    const timer = window.setTimeout(() => setShake(false), 450);
    return () => window.clearTimeout(timer);
  }, [shake]);

  useEffect(() => {
    const timer = window.setTimeout(() => setInitialAnimation(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (values) => {
    if (!navigator.onLine) {
      notification.error({
        message: "No Internet Connection",
        description: "Please check your internet and try again.",
      });
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "loginUser",
          userEmail: String(values.userEmail || "").trim(),
          password: String(values.password || ""),
        }).toString(),
        signal: controller.signal,
      });

      if (response.status === 404) {
        const error = new Error(
          "Google Apps Script Web App returned HTTP 404. Check the deployment URL and access permissions."
        );
        error.code = "GAS_DEPLOYMENT_404";
        throw error;
      }
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Google Apps Script returned invalid JSON.");
      }

      if (data && data.success) {
        notification.success({
          message: "Login Successful",
          description: `Welcome ${String(values.userEmail || "")
            .trim()
            .split("@")[0]}!`,
        });

        if (typeof onLoginSuccess === "function") {
          onLoginSuccess({
            email: String(values.userEmail || "").trim(),
            access: data.access,
          });
        } else {
          notification.error({
            message: "Login Handler Missing",
            description: "The app did not provide an onLoginSuccess handler.",
          });
        }
      } else {
        setShake(true);
        notification.error({
          message: "Login Failed",
          description: (data && data.message) || "Invalid email or password.",
        });
      }
    } catch (error) {
      notification.error({
        message:
          error && error.code === "GAS_DEPLOYMENT_404"
            ? "Backend Deployment Error"
            : "Unable to Log In",
        description:
          error && error.name === "AbortError"
            ? "Login request timed out. Please try again."
            : (error && error.message) || "Unable to connect to the backend.",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <main className="haitian-login-page">
      <div
        className={`haitian-login-shell ${
          initialAnimation ? "login-entrance" : ""
        }`}
      >
        <section
          className="haitian-brand-panel"
          aria-label="Haitian Service Report"
        >
          <img
            src={HaitianBackgroundImage}
            className="haitian-banner-image"
            alt="Haitian industrial injection moulding machines"
            aria-hidden="true"
          />
          <div className="haitian-banner-overlay" aria-hidden="true" />

          <header className="brand-top">
            <img src={HaitianLogo} alt="Haitian logo" className="brand-logo" />
          </header>

          <div className="brand-content">
            <div className="brand-eyebrow">HAITIAN SERVICE REPORT</div>
            <h1>
              Service reports.
              <br />
              <span>Organized. Reliable.</span>
            </h1>
            {/* <p>
              A central workspace for customer visits, machine details, service
              findings, and follow-up actions.
            </p> */}

            <div className="brand-feature-list" aria-label="Portal features">
              <div className="brand-feature">
                <span className="brand-feature-index" aria-hidden="true">
                  01
                </span>
                <span className="brand-feature-copy">
                  <strong>Service records</strong>
                  <small>Create and manage service reports</small>
                </span>
              </div>
              <div className="brand-feature">
                <span className="brand-feature-index" aria-hidden="true">
                  02
                </span>
                <span className="brand-feature-copy">
                  <strong>Customer and machine details</strong>
                  <small>Keep visit information in one place</small>
                </span>
              </div>
              <div className="brand-feature">
                <span className="brand-feature-index" aria-hidden="true">
                  03
                </span>
                <span className="brand-feature-copy">
                  <strong>Effortless search</strong>
                  <small>Track findings and next actions</small>
                </span>
              </div>
            </div>
          </div>

      
        </section>

        <section className="haitian-form-panel" aria-label="Sign in">
          <div className={`haitian-login-card ${shake ? "login-shake" : ""}`}>
            <div className="login-brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="login-heading">
              <span className="login-overline">HAITIAN SERVICE REPORT</span>
              <h2>Welcome back<span>.</span></h2>
              <p>Sign in with your company account to continue.</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit}
              className="haitian-login-form"
            >
              <Form.Item
                label="Work email"
                name="userEmail"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter your email address.",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address.",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="email"
                  autoComplete="username"
                  placeholder="username@haitianme.com"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password.",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </Form.Item>

              <Button
                className="haitian-login-button"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={loading}
              >
                <span>{loading ? "Signing in..." : "Sign in securely"}</span>
                {!loading && (
                  <span className="login-button-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </Button>

              <div className="login-security-note">
                <span  >
                  <SafetyOutlined />
                </span>
                <span>Authorized personnel only</span>
              </div>
            </Form>

            <footer className="login-card-footer">
              <span>© {new Date().getFullYear()} Haitian Service Report</span>
              <span className="login-footer-separator" aria-hidden="true">
                •
              </span>
              <span>All rights reserved</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
