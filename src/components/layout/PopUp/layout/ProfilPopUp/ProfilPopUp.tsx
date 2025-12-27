'use client'

import React from 'react'
import PopUp from '../../PopUp'
import { UserResponseDTO } from '@/types/user'
import Image from 'next/image'
import LetterAvatar from '@/components/atoms/Avatar/LetterAvatar'
import ProfilCard from './atoms/card/ProfilCard'
import Tab from './atoms/tab/Tab'
import { UserIcon } from '@/assets/icons'
import ThemeSwitcher from '../ThemeSwitcher'

function ProfilPopUp({ user }: { user: UserResponseDTO }) {


    const Avatar = () => {
        if (user.imageURL) {
            return <Image src={user.imageURL} alt={user.username} width={64} height={64} tabIndex={0}/>
        }
        return <LetterAvatar letter={user.username}/>
    }


  return (
    <PopUp>
        <PopUp.Trigger>
            <Avatar />
        </PopUp.Trigger>
        <PopUp.Container width={320}>
            <ProfilCard user={user} />
            <Tab title="Profil" icon={UserIcon} href="/profil"  />
            <ThemeSwitcher isExpanded={true} />
        </PopUp.Container>
    </PopUp>
  )
}

export default ProfilPopUp