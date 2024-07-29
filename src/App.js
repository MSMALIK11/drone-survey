
import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";
import api from './services';
import { startTokenRefreshInterval } from "./helper/refreshToken";
import LandingPage from "./pages/LandingPage";

// Lazy-loaded components
const Home = React.lazy(() => import("./pages/Home"));
const Dataprocessing = React.lazy(() => import("./pages/Dataprocessing"));
const Dashbord = React.lazy(() => import("./pages/Dashbord"));
const Login = React.lazy(() => import("./components/Login"));
const NewProject = React.lazy(() => import("./components/NewProject"));
// const UploadDataProcessing = React.lazy(() => import("./components/UploadDataProcessing"));
const ForgetPassword = React.lazy(() => import("./components/ForgetPassword"));
const NewSignUp = React.lazy(() => import("./components/NewSignUp"));
const OtpModel = React.lazy(() => import("./components/OtpModel"));
const ResetPasswordRequest = React.lazy(() => import("./components/ResetPasswordRequest"));
const ResetPasswordForm = React.lazy(() => import("./components/ResetPaswordForm"));
const ProjectDetails = React.lazy(() => import("./pages/ProjectDetails"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const UploadImageDashboard = React.lazy(() => import("./pages/UploadImageDashboard"));
const App = () => {
  const [loading, setLoading] = useState(true);
  const getUserProfile = async () => {
    setLoading(true);
    try {
      const res = await api.dashboardApi.getUserProfile();
      if (res.status === 200) {
        if (!localStorage.getItem('intervalId')) {
          startTokenRefreshInterval();
        }
        localStorage.setItem("auth-user", JSON.stringify(res.data));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error while fetching user data:', error);
      setLoading(false);
      localStorage.removeItem("auth-user");
      localStorage.removeItem('intervalId');
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

 

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={<Suspense fallback={<LoadingScreen />}><Login  /></Suspense>} />
      <Route path="/newSignUp" element={<Suspense fallback={<LoadingScreen />}><NewSignUp /></Suspense>} />
      <Route path="/ForgetPassword" element={<Suspense fallback={<LoadingScreen />}><ForgetPassword /></Suspense>} />
      <Route path="/otp" element={<Suspense fallback={<LoadingScreen />}><OtpModel /></Suspense>} />
      <Route path="/password-reset/request" element={<Suspense fallback={<LoadingScreen />}><ResetPasswordRequest /></Suspense>} />
      <Route path="/password-reset/verify" element={<Suspense fallback={<LoadingScreen />}><ResetPasswordForm /></Suspense>} />
      {/* <Route path="/uploadDataProcessing" element={<Suspense fallback={<LoadingScreen />}><UploadDataProcessing /></Suspense>} /> */}
      <Route path="/project/upload" element={<Suspense fallback={<LoadingScreen />}><UploadImageDashboard /></Suspense>} />
      <Route path="/drone-survey" element={<Suspense fallback={<LoadingScreen />}><LandingPage /></Suspense>} />

      <Route path="/" element={<SideBar />}>
        <Route
          path="/"
          element={
            <ProtectedRoute >
              <Suspense fallback={<LoadingScreen />}>
                <Home />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <NewProject />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/details"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <ProjectDetails />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <UploadImageDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataprocessing"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Dataprocessing />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashbord"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Dashbord />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/*" element={<Suspense fallback={<LoadingScreen />}><NotFound /></Suspense>} />
    </Routes>
  );
};

export default App;

