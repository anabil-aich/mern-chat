import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom'
import axios from 'axios';



const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'auto'
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
    signinRedirect: {
        margin: theme.spacing(3)
    }
}));


const Register = (props) => {
    const classes = useStyles();
    const [name, setName] = useState('')
    const [nameValidation, setNameValidation] = useState(false)
    const [nameValidationText, setNameValidationText] = useState('')
    const [email, setEmail] = useState('')
    const [emailValidation, setEmailValidation] = useState(false)
    const [emailValidationText, setEmailValidationText] = useState('')
    const [password, setPassword] = useState('')
    const [passwordValidation, setPasswordValidation] = useState(false)
    const [passwordValidationText, setPasswordValidationText] = useState('')
    const [open, setOpen] = useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const redirectToLogin = () => {
        props.history.push("/login")
    }


    const registerUser = (event) => {
        event.preventDefault()
        axios.post('https://mern-chat-material.herokuapp.com/user/register', {
            name,
            email,
            password
        }).then((response) => {
            setOpen(true);
            //props.history.push("/login")
        }).catch((err) => {
            if (err.response.data.name) {
                setNameValidation(true)
                setNameValidationText(err.response.data.name)
            }
            if (err.response.data.email) {
                setEmailValidation(true)
                setEmailValidationText(err.response.data.email)
            }
            if (err.response.data.password) {
                setPasswordValidation(true)
                setPasswordValidationText(err.response.data.email)
            }
        })
    }



    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography component="h1" variant="h5" className={classes.header}>
                Sign up
        </Typography>
            <form noValidate autoComplete="off" className={classes.form} onSubmit={registerUser}>
                <TextField className={classes.textField}
                    variant="outlined"
                    margin="normal"
                    required
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    error={nameValidation}
                    helperText={nameValidationText}
                />
                <TextField className={classes.textField}
                    variant="outlined"
                    margin="normal"
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    error={emailValidation}
                    helperText={emailValidationText}
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
                    onChange={e => setPassword(e.target.value)}
                    error={passwordValidation}
                    helperText={passwordValidationText}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Register
                    </Button>
                <Typography component="h1" className={classes.signinRedirect}>
                    <Link to="/login" variant="body2">
                        {"Already have an account? Sign in"}
                    </Link>
                </Typography>
            </form>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Congratulations!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        User registered successfully!
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={redirectToLogin} color="primary">
                        Login to Continue
          </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Close
          </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default Register;