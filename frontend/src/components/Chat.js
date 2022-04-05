import React, { useRef, useState } from 'react'
import styles from "./Chat.module.css"
import bernalogo from "../bernalogo.png"

export default function Chat() {

    const [online, setOnline] = useState(false);
    const [chat, setChat] = useState([]);
    const messageRef = useRef();

    function handleChat(e) {
        const message = messageRef.current.value;
        if (message === "") return
        setChat(prevChat => {
            return [...prevChat, {sender: "imessage", message: message}]
        })
        messageRef.current.value = null
    }

    function enterKey(event) {
        if (event.key == "Enter") {
            const message = messageRef.current.value;
            if (message === "") return
            setChat(prevChat => {
                return [...prevChat, {sender: "imessage", message: message}]
            })
            messageRef.current.value = null
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
