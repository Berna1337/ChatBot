import React, { useRef, useState, useEffect } from 'react'
import styles from "./Chat.module.css"
import bernalogo from "../bernalogo.png"

export default function Chat() {

    const [online, setOnline] = useState(false);
    const [chat, setChat] = useState([]);
    const messageRef = useRef();

    useEffect(() => {
        checkBot()
    }, [chat])
    

    function checkBot() {
    fetch('/api/bot', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status == 200) {
                    setOnline(true)
                    return
                }
                else if (res.status == 500) {
                    setOnline(false)
                    return
                }
            })
            .catch(error => console.log(error))
    }

    function checkMessage(arg) {
        fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({sender: "imessage", message: arg})
            }).then(res => {
                return res.json()
            })
            .then(data => {
                if (!data) return
                setChat(prevChat => {
                    return [...prevChat, data]
                })
                return data
            })
            .catch(error => console.log(error))
    }

    function handleChat(e) {
        const message = messageRef.current.value;
        if (message === "") return
        setChat(prevChat => {
            return [...prevChat, {sender: "imessage", message: message}]
        })
        checkMessage(message)
        messageRef.current.value = null
    }

    function enterKey(e) {
        if (e.key == "Enter") {
            handleChat()
        }
    }

    return (
    <div>
        <div className={styles.chattitle}>
            <img src={bernalogo} className={online ? styles.logoonline : styles.logooffline} />
            <span className={styles.title} >Chat Bot</span>
        </div>
        <div className={styles.messages}>
            {chat.map((e, i) => <div className={e.sender == "imessage" ? styles.imessage : styles.botmessage} key={i}>{e.message}</div>)}
        </div>
        <div className={styles.bottom}>
            <input ref={messageRef} type="text" placeholder='message...' onKeyPress={enterKey} className={styles.message} />
            <button onClick={handleChat} className={styles.send}>
                <span className="material-icons">send</span>
            </button>
        </div>
        <p className={styles.sub}>visor.ai Web Dev Challenge by Bernardo Cruz</p>
    </div>
    )
}
