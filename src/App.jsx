import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/shared/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import Forgotpassword from "./pages/Forgotpassword";
import Overview from "./components/Overview";
import AuthLayout from "./components/shared/AuthLayout";
import Election from "./components/Election";
import Candidates from "./components/Candidates";
import Create from "./components/Create";
import Landing from "./pages/Landing";
import VoterLayout from "./components/shared/VoterLayout";
import VoterLogin from "./pages/VoterLogin";
import {
  VotersWelcome,
  ElectionInfo,
  Vote,
  VotingEnd,
  VoterSelect,
} from "./components/VotersWelcome";
import ErrorPage from "./components/ErrorPage";
import Voters from "./components/Voters";
import { hasValidVoterSession } from "./api/auth";

// Voter pages require a valid (present, unexpired) JWT from /voter/login.
function RequireVoter({ children }) {
  if (!hasValidVoterSession()) {
    return <Navigate to="/voters/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />}></Route>

          <Route path="voters" element={<VoterLayout />}>
            <Route path="login" element={<VoterLogin />}></Route>
            <Route
              index
              element={
                <RequireVoter>
                  <VotersWelcome />
                </RequireVoter>
              }
            ></Route>
            <Route
              path="info"
              element={
                <RequireVoter>
                  <ElectionInfo />
                </RequireVoter>
              }
            ></Route>
            <Route
              path="vote"
              element={
                <RequireVoter>
                  <Vote />
                </RequireVoter>
              }
            ></Route>
          </Route>
          <Route path="votingend" element={<VotingEnd />}></Route>
          <Route
            path="voterselect"
            element={
              <RequireVoter>
                <VoterSelect />
              </RequireVoter>
            }
          ></Route>

          <Route path="dashboard" element={<Layout />}>
            <Route index element={<Overview />}></Route>
            <Route path="election" element={<Election />}></Route>
            <Route path="voters" element={<Voters />}></Route>
            <Route path="candidate" element={<Candidates />}></Route>
            <Route path="create" element={<Create />}></Route>
          </Route>

          <Route path="organization" element={<AuthLayout />}>
            <Route index element={<Login />}></Route>
            <Route path="signup" element={<Signup />}></Route>
            <Route path="forgotpassword" element={<Forgotpassword />}></Route>
            <Route path="otp" element={<OTP />}></Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
