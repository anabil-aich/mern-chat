import React, { useEffect } from "react"


const Index = (props) => {
    useEffect(() => {
        const token = localStorage.getItem("MERN_Token");
        if (!token) {
            props.history.push("/login")
        }
        else {
            props.history.push("/dashboard")
        }
    })
    return (<div></div>)
}

export default Index;