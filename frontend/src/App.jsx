import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './Styles/App.css'
import BaseLayout from './Pages/BaseLayout'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/AddUser'
import ExamMonitoring from './Pages/ExamMonitoring'
import AdminDashboard from './Pages/AdminDashboard'
import UserDashboard from './Pages/UserDashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import UserBaseLayout from './Pages/UserBaseLayout'
import AddUser from './Pages/AddUser'
import AddLab from './Pages/AddLab'
import EditUser from './Pages/EditUser'
import EditLab from './Pages/EditLab'
import About from './Pages/About'
import ErrorPage from './Pages/ErrorPage'

function App() {
  // console.log('App api url: ', process.env.REACT_APP_API_URL)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route path="admin" element={<ProtectedRoute adminOnly={true}><UserBaseLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="addlab" element={<AddLab />} />
          <Route path="edituser/:id" element={<EditUser />} />
          <Route path="editlab/:id" element={<EditLab />} />
        </Route>

        <Route path="user" element={<ProtectedRoute><UserBaseLayout /></ProtectedRoute>}>
          <Route index element={<UserDashboard />} />
        </Route>
        <Route path="user/exam/:labCode" element={<ProtectedRoute><ExamMonitoring /></ProtectedRoute>} />

        <Route path="*" element={<ErrorPage code={404} message="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
