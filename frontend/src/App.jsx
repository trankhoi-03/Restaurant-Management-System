import { useState } from "react";
import Menu from "./Menu";
import Kitchen from "./Kitchen";
import Cashier from "./Cashier";
import Login from "./Login";

function App() {
    const [user, setUser] = useState(null)
    const [view, setView] = useState('menu')

    const handleLoginSuccess = (userData) => {
      setUser(userData)

      if (userData.role === 'cook') setView('kitchen')
      else if (userData.role === 'cashier') setView('cashier')
      else if (userData.role === 'admin') setView('menu')
    }

    const handleLogout = () => {
      setUser(null)
      setView('menu')
    }

    const renderContent = () => {
      if (view === 'login') return <Login onLoginSucces={handleLoginSuccess}/>
      if (view === 'menu') return <Menu />
      if (view === 'kitchen') return <Kitchen />
      if (view === 'cashier') return <Cashier /> 
    }

    return (
    <div>
      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-dark bg-dark mb-3">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Halo Restaurant 
            {user && <span className="badge bg-secondary ms-2">{user.role.toUpperCase()}</span>}
          </span>
          
          <div>
            {/* 1. GUEST VIEW (Not Logged In) */}
            {!user && view !== 'login' && (
               <button className="btn btn-outline-light btn-sm" onClick={() => setView('login')}>Staff Login</button>
            )}

            {/* 2. LOGGED IN VIEW */}
            {user && (
                <>
                    {/* Admin sees ALL buttons */}
                    {user.role === 'admin' && (
                        <>
                            <button className={`btn btn-sm me-2 ${view === 'menu' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setView('menu')}>Menu</button>
                            <button className={`btn btn-sm me-2 ${view === 'kitchen' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setView('kitchen')}>Kitchen</button>
                            <button className={`btn btn-sm me-2 ${view === 'cashier' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setView('cashier')}>Cashier</button>
                        </>
                    )}

                    {/* Cook only sees Kitchen button (optional, since they are auto-redirected) */}
                    {user.role === 'cook' && view !== 'kitchen' && (
                         <button className="btn btn-light btn-sm me-2" onClick={() => setView('kitchen')}>Kitchen</button>
                    )}

                    {/* Cashier only sees Cashier button */}
                    {user.role === 'cashier' && view !== 'cashier' && (
                         <button className="btn btn-light btn-sm me-2" onClick={() => setView('cashier')}>Cashier</button>
                    )}

                    <button className="btn btn-danger btn-sm ms-3" onClick={handleLogout}>Logout</button>
                </>
            )}
          </div>
        </div>
      </nav>
      
      {/* --- MAIN CONTENT --- */}
      {renderContent()}
      
    </div>
  );
}

export default App