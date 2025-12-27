import React from 'react'
import { UserResponseDTO } from '@/types/user'
import LetterAvatar from '@/components/atoms/Avatar/LetterAvatar'
import Image from 'next/image'
import styles from './styles.module.scss'

function ProfilCard({ user }: { user: UserResponseDTO }) {
  
    const Avatar = () => {
        if (user.imageURL) {
            return <Image src={user.imageURL} alt={user.username} width={42} height={42} tabIndex={0}/>
        }
        return <LetterAvatar letter={user.username} className={styles.avatar} />
    }
    return (
    <div className={styles.profilCard}>
        <Avatar />
        <div>
            <h3>{user.username}</h3>
            <p>{user.email}</p>
        </div>
    </div>
  )
}

export default ProfilCard