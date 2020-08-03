import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import ScrollToBottom from 'react-scroll-to-bottom';



const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '500px'
    },
    messageContainer: {
        width: '100%',
        height: '100%',
        overflowY: 'scroll'
    },
    adminBubble: {
        background: '#c3b8b8',
        display: 'flex',
        margin: '8px auto',
        justifyContent: 'center',
        boxSizing: 'border-box',
        maxWidth: '60%',
        borderRadius: '4px'
    },
    myBubble: {
        background: '#3f51b5',
        display: 'flex',
        boxSizing: 'border-box',
        borderRadius: '20px 20px 0px 20px',
        color: '#fff',
        margin: '8px',
        padding: '20px',
        height: 'fit-content'
    },
    otherBubble: {
        background: '#8190e4bf',
        display: 'flex',
        boxSizing: 'border-box',
        borderRadius: '20px 20px 20px 0px',
        color: '#fff',
        margin: '8px',
        padding: '20px',
        height: 'fit-content'
    }
}))


let socket;
const ChatRoom = (props) => {
    const classes = useStyles();
    const chatRoomId = props.match.params.id;
    const token = localStorage.getItem("MERN_Token")
    const [messages, setMessages] = useState([])
    const [userMessage, setMessage] = useState('')
    const [userId, setUserId] = useState('')
    useEffect(() => {
        socket = io("https://mern-chat-material.herokuapp.com", {
            query: {
                token
            }
        })

        socket.emit('joinChatRoom', { chatRoomId })


        return () => {
            socket.emit('leaveChatRoom', { chatRoomId })
            socket.off()
        }
    }, [chatRoomId])


    useEffect(() => {
        const token = localStorage.getItem("MERN_Token")
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]))
            setUserId(payload.id)
        }
        socket.on('newMessage', (messagedetail) => {
            setMessages([...messages, messagedetail])
            setMessage('')
        })

    }, [messages])

    const sendUserMessage = (event) => {
        event.preventDefault();
        socket.emit('chatRoomMessage', {
            chatRoomId,
            message: userMessage
        })
    }
    return (
        <Paper elevation={3} className={classes.paper}>
            <div className={classes.messageContainer}>
                <ScrollToBottom>
                    {messages.map((message, index) => {
                        if (message.userId === 'admin') return (<div className={classes.adminBubble} key={index}>{message.message}</div>)
                        if (message.userId === userId) return (<div className={classes.myBubble} key={index}>{message.name}: {message.message}</div>)
                        else return (<div className={classes.otherBubble} key={index}>{message.name}: {message.message}</div>)
                    })}
                </ScrollToBottom>
            </div>
            <Grid container spacing={1} alignItems="flex-end">
                <Grid item xs={10}>
                    <TextField
                        id="message-text"
                        multiline
                        rows={1}
                        placeholder="Type a message"
                        variant="outlined"
                        autoFocus
                        fullWidth
                        value={userMessage}
                        onChange={event => setMessage(event.target.value)}
                        onKeyPress={event => event.key === 'Enter' ? sendUserMessage(event) : null}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Fab color="primary" aria-label="add" onClick={sendUserMessage}>
                        <SendIcon />
                    </Fab>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default withRouter(ChatRoom)