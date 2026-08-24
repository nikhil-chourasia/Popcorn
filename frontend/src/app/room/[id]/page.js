"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const WS_URL = API.replace("http", "ws");

export default function RoomPage() {
    const { id } = useParams();
    const wsRef = useRef(null);
    const [roomState, setRoomState] = useState(null);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // 1. Fetch initial room state
        fetch(`${API}/api/room/${id}`, { credentials: "include" })
            .then(r => {
                if (!r.ok) throw new Error("Room not found");
                return r.json();
            })
            .then(setRoomState)
            .catch(err => {
                console.error(err);
                // Handle error (e.g., redirect or show message)
            });

        // 2. Open WebSocket
        const ws = new WebSocket(`${WS_URL}/ws/room/${id}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case "state":
                    // Initial room state on join
                    setRoomState(prev => ({ ...prev, ...msg }));
                    break;
                case "joined":
                    setMembers(prev => [...prev, msg.name]);
                    break;
                case "left":
                    setMembers(prev => prev.filter(n => n !== msg.name));
                    break;
                case "play":
                case "pause":
                case "seek":
                    // Phase 2: sync the video element here
                    console.log("sync event:", msg);
                    break;
            }
        };

        ws.onclose = () => console.log("WS closed");

        return () => ws.close();
    }, [id]);

    if (!roomState) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Connecting to room...</p>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <h1 className={styles.title}>Room {id.toUpperCase()}</h1>
                <div className={styles.card}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>File ID:</span>
                        <span className={styles.value}>{roomState.fileId}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Host ID:</span>
                        <span className={styles.value}>{roomState.hostId || 'N/A'}</span>
                    </div>
                </div>

                <div className={styles.membersSection}>
                    <h2 className={styles.subtitle}>Active Members ({members.length})</h2>
                    {members.length === 0 ? (
                        <p className={styles.emptyState}>Waiting for others to join...</p>
                    ) : (
                        <ul className={styles.memberList}>
                            {members.map((m, i) => (
                                <li key={i} className={styles.memberItem}>
                                    <div className={styles.avatar}>{m.charAt(0).toUpperCase()}</div>
                                    <span>{m}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.placeholder}>
                    <p>Video Player will be added in Phase 2</p>
                </div>
            </div>
        </div>
    );
}
