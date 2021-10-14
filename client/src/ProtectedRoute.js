import React from 'react';
import {Route, Redirect} from 'react-router-dom';


function ProtectedRoute({isAuth, compoonent:Component, ...rest}) {
    return ( 
        <Route 
            {...rest} 
            render={(props) => {
            if(isAuth) {
                return <Component />
            }
            else {
                return <Redirect to={{pathname : '/', state: {from: props.location}}}/>
            }
            }}
        
        />
    );
}

export default ProtectedRoute
