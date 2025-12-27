import React from 'react'
import ThemeSwitcher from '../../PopUp/layout/ThemeSwitcher'
import LoginRegisterWrapper from '../LoginRegisterWrapper/LoginRegisterWrapper'
import styles from './TrailingWrapper.module.scss'
import { getMyUser } from '@/actions/user'
import { UserResponseDTO } from '@/types/user'
import { Response, ResponseError } from '@/types/response'
import ProfilPopUp from '../../PopUp/layout/ProfilPopUp/ProfilPopUp'

async function TrailingWrapper() {

const user = await getMyUser() as Response<UserResponseDTO> | ResponseError


  return (
    <div className={styles.trailingWrapper}>
        {!user.success && <ThemeSwitcher isExpanded={false} />}
        {user.success ? <ProfilPopUp user={user.data} /> : <LoginRegisterWrapper />}
    </div>
    )

}

export default TrailingWrapper