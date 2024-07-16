import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedPage from "./components/ProtectedPage";
import GroupChat from "./pages/GroupChat/GroupChat";
import FindClan from "./pages/FindClan/FindClan";
import CreateClan from "./pages/CreateClan/CreateClan";
import Settings from "./pages/Settings/Settings";
import DefaultPage from "./pages/DefaultPage/DefaultPage";
import NotFound from "./pages/NotFound/NotFound";
import Profile from "./pages/Profile/Profile";
import SearchClan from "./components/SearchClan";
import BookMarked from "./components/BookMarked";
import ClanDetails from "./pages/ClanDetails/ClanDetails";
import EditProfile from "./pages/EditProfile/EditProfile";
function App() {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <>
      <div>
        {loading && <Spinner />}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedPage>
                  <Home />
                </ProtectedPage>
              }
            >
              <Route
                path="findclan"
                element={
                  <ProtectedPage>
                    <FindClan />
                  </ProtectedPage>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedPage>
                      <SearchClan />
                    </ProtectedPage>
                  }
                />
                <Route
                  path="bookmarks"
                  element={
                    <ProtectedPage>
                      <BookMarked />
                    </ProtectedPage>
                  }
                />
              </Route>
              <Route
                index
                element={
                  <ProtectedPage>
                    <DefaultPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="createclan"
                element={
                  <ProtectedPage>
                    <CreateClan />
                  </ProtectedPage>
                }
              />
              <Route
                path="blogs"
                element={
                  <ProtectedPage>
                    <DefaultPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="updates"
                element={
                  <ProtectedPage>
                    <DefaultPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedPage>
                    <Settings />
                  </ProtectedPage>
                }
              />
              <Route
                path="news"
                element={
                  <ProtectedPage>
                    <DefaultPage />
                  </ProtectedPage>
                }
              />
              <Route
                path="/chat/clan/:clanId"
                element={
                  <ProtectedPage>
                    <GroupChat />
                  </ProtectedPage>
                }
              />
              <Route
                path="profile/:id"
                element={
                  <ProtectedPage>
                    <Profile />
                  </ProtectedPage>
                }
              />
              <Route
                path="clan/:clanId"
                element={
                  <ProtectedPage>
                    <ClanDetails />
                  </ProtectedPage>
                }
              />
              <Route
                path="user/edit"
                element={
                  <ProtectedPage>
                    <EditProfile />
                  </ProtectedPage>
                }
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
