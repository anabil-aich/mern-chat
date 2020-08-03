import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';



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
        marginTop: theme.spacing(1),
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
        width: '150px'
    },
}));


function Dashboard(props) {
    const classes = useStyles();
    const [chatRoom, setChatRoom] = useState('')
    const [chatRooms, setChatRooms] = useState([])

    const getChatRooms = () => {
        axios.get('https://mern-chat-material.herokuapp.com/chatroom', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("MERN_Token")
            }
        })
            .then((response) => {
                setChatRooms(response.data)
            })
            .catch((error) => {
                console.log(error.response.data)
            })
    }
    useEffect(() => {
        getChatRooms()

    }, [])

    const createChatRoom = (event) => {
        event.preventDefault()
        axios.post('https://mern-chat-material.herokuapp.com/chatroom', {
            name: chatRoom
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("MERN_Token")
            }
        })
            .then((response) => {
                props.history.push('/chatroom/' + response.data.id)
            })
            .catch((error) => {
                console.log(error.response.data)
            })
    }


    return (
        <Paper elevation={3} className={classes.paper}>
            <Typography component="h1" variant="h5" className={classes.header}>
                Create Room
        </Typography>
            <form noValidate autoComplete="off" className={classes.form} onSubmit={createChatRoom}>
                <TextField className={classes.textField}
                    variant="outlined"
                    margin="normal"
                    required
                    id="chatRoomName"
                    label="Create chat room"
                    name="chatRoomName"
                    autoComplete="chatRoomName"
                    autoFocus
                    value={chatRoom}
                    onChange={event => setChatRoom(event.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Create Room
                    </Button>
            </form>
            <Typography component="h5" variant="h5" className={classes.header} style={{ fontWeight: '400', fontSize: '1rem', marginTop: '1%' }}>
                Or<br />Choose from the below existing room
        </Typography>
            <List component="nav" aria-label="secondary mailbox folders" style={{ maxHeight: '30%', overflowY: 'scroll', width: '100%' }}>
                <Divider />
                {chatRooms.map((chatRoom) => {
                    return (
                        <React.Fragment key={chatRoom._id}>
                            <Link to={"/chatroom/" + chatRoom._id}>
                                <ListItem button>
                                    <ListItemText primary={chatRoom.name} />
                                </ListItem>
                            </Link>
                            <Divider />

                        </React.Fragment>
                    )
                })}
            </List>



        </Paper>
    )
}

export default Dashboard;