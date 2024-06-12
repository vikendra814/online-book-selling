import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import P404 from "./components/P404";
import Home from "./components/Home";
import OrderHistory from "./components/OrderHistory";
import AddBook from "./components/AddBook";
import BookListing from "./components/BookListing";
import Navbar from "./components/Navbar";
import UserNav from "./userComponents/Navbar";
import UserHome from "./userComponents/UserHome";
import OrderDetail from"./userComponents/OrderDetail";
import Cart from "./userComponents/Cart";
import Protected from "./utils/Protected.config";
import { DarkModeContextProvider } from "./utils/ThemeContext";

function App() {
  return (
    <div className="App">
      <DarkModeContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Signup />} />
            <Route path="*" element={<P404 />} />
            <Route
              path="/home"
              element={
                <Protected>
                  <Navbar />
                  <Home />
                </Protected>
              }
            />
            <Route
              path="/userhome"
              element={
                <Protected>
                  <UserNav />
                  <UserHome />
                </Protected>
              }
            />

            <Route
              // path="/BookListing/:id" //use params hook
              path="/BookListing"
              element={
                <Protected>
                  <Navbar />
                  <BookListing />
                </Protected>
              }
            />
            <Route
              path="/addBook"
              element={
                <Protected>
                  <Navbar />
                  <AddBook />
                </Protected>
              }
            />
            <Route
              path="/order-listing"
              element={
                <Protected>
                  <Navbar />
                  <OrderHistory />
                </Protected>
              }
            />

            <Route
              path="/cart"
              element={
                <Protected>
                   <UserNav />
                  <Cart />
                </Protected>
              }
            />
            <Route
              path="/order-detail"
              element={
                <Protected>
                   <UserNav />
                  <OrderDetail />
                </Protected>
              }
            />
          </Routes>
        </BrowserRouter>
      </DarkModeContextProvider>
    </div>
  );
}

export default App;
