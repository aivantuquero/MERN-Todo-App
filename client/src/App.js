import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './ProtectedRoute';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { authToTrue, setAccessToken, setName, setId } from './redux/userSlice';

function App() {

    //hooks
    const isAuthState = useSelector((state) => state.User.isAuth);
    const history = useHistory();
    const dispatch = useDispatch();

    const session = localStorage.getItem("SESSION_COOKIE");
    
    
    if(session && !isAuthState) {
        const decoded = jwt_decode(session);
    
        dispatch(authToTrue());
        dispatch(setName(decoded.name));
        dispatch(setId(decoded.id));
    }

    return (
        <Router>
            <Switch>
                {/* login */}
                <Route exact path="/">
                    {isAuthState ? <Redirect to="/home" /> : <SignIn />}
                </Route>
                <Route exact path="/signup">
                    {isAuthState ? <Redirect to="/home" /> : <SignUp />}
                </Route>
                <ProtectedRoute exact path="/home" compoonent={Home} isAuth={isAuthState}/>

            </Switch>
        </Router>
    )
}

export default App;