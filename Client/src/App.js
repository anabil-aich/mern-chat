import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography';
import Login from './components/login/login'
import Register from './components/register/register'
import Dashboard from './components/Dashboard/dashboard'
import Index from './components/index'
import ChatRoom from './components/ChatRoom/ChatRoom';




const useStyles = makeStyles((theme) => ({
  topBar: {
    height: '80px',
    justifyContent: 'center'
  }
}));

function App() {
  const classes = useStyles();

  return (
    <div className="App" >
      <div className="mainContent">
        <AppBar position="static" className={classes.topBar} >
          <Typography variant="h6">
            MERN Chat
          </Typography>
        </AppBar>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Index} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/chatroom/:id" component={ChatRoom} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
