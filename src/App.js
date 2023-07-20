import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import './App.css';
import Reports from './Reports';
import Users from './Users'; 
import Entries from './Entries';
import admin from './admin.png';


const firebaseConfig = {
  apiKey: "AIzaSyAPkEij3DdYuKo3hWvnuWBRZ5uP5JW-HvA",
  authDomain: "guard-up-2e411.firebaseapp.com",
  projectId: "guard-up-2e411",
  storageBucket: "guard-up-2e411.appspot.com",
  messagingSenderId: "102644584064",
  appId: "1:102644584064:web:6baccadce4b17c1fa26065"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

function App() {
  return (
    <Router>
      <div className="App">

        <div className="menu-panel">
        <div className="logo">
          <img src={admin} alt="Logo" width="80" />
        </div>
        <p className="hello-admin">Hello, Admin!</p> 
          <h1>Guard UP</h1>
          <nav>
            <ul>
              <li>
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/entries">Entries</Link>
              </li>
              <li>
                <Link to="/reports">Reports</Link>
              </li>
            </ul>
          </nav>
        </div>
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/users" />} />
            <Route path="/users" element={<Users db={db} />} /> 
            <Route path="/entries" element={<Entries db={db} />} /> 
            <Route path="/reports" element={<Reports db={db} />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export { app };
export default App;