import React from 'react'

export type UserData = {
    id:number,
    name: string
}

const UserPil: React.FC<UserData> = (user) => {
    return (
        <div className="bg-white text-[12px] leading-[14px] text-black p-[5px] px-[10px] rounded-[8px]">{user.name}</div>
    )
}

export default UserPil