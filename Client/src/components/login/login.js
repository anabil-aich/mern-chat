import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '500px'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '85%'
    },
    header: {
        margin: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        height: '40px',
        width: '100px'
    },
}));


function Login(props) {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false)
    const [emaiErrorText, setEmailErrorText] = useState('')
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorText, setPasswordErrorText] = useState('')

    const loginUser = (event) => {
        event.preventDefault()
        axios.post('https://mern-chat-material.herokuapp.com/user/login', {
            email,
            password
        }).then((response) => {
            localStorage.setItem("MERN_Token", response.data.token)
            props.history.push('/dashboard')
        }).catch((err) => {
            console.log(err.response.data)
            if (err.response.data.email) {
                setEmailError(true)
                setEmailErrorText(err.response.data.email)
            }
            if (err.response.data.password) {
                setPasswordError(true)
                setPasswordErrorText(err.response.data.password)
            }
            if (err.response.data.error) {
                setEmailError(true)
                setEmailErrorText(err.response.data.error)
                setPasswordError(true)
                setPasswordErrorText(err.response.data.error)
            }
        })
    }
    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography component="h1" variant="h5" className={classes.header}>
                Sign in
        </Typography>
            <form noValidate autoComplete="off" className={classes.form} onSubmit={loginUser}>
                <TextField className={classes.textField}
                    variant="outlined"
                    margin="normal"
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={emailError}
                    helperText={emaiErrorText}
                />
                <TextField className={classes.textField}
                    variant="outlined"
                    margin="normal"
                    required
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    error={passwordError}
                    helperText={passwordErrorText}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Sign In
                    </Button>
                <Typography component="h1">
                    <Link to="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Typography>
            </form>
        </Paper>
    )
}

export default Login;