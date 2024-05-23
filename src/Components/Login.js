import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
function Login({onLogin}){
    const un = 'alice1306';
    const pwd = 'reset123';
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username && password) {
      const fakeToken = '1234567890abcdef';
      if(username === un && password === pwd)
        onLogin(fakeToken);
    } else {
      alert('Incorrect username or password');
    }
  };
    return(
        <div className="container mt-5 ">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center gradient-text">Book Archive Login</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 p-2">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="mb-3 p-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )


}
 export default Login;