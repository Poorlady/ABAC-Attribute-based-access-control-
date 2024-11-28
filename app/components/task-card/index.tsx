import React from 'react'
import UserPil from '../user-pil'
import { TaskData } from '../task-page'

const TaskCard: React.FC<TaskData> = ({ title, sharedWith }) => {
    return (
        <div className="px-[10px] py-[20px] flex bg-[crimson] items-start items-center justify-between">
            <div className="flex flex-col gap-[20px]">
                <div className="text-[18px] leading-[20px]">{title}</div>
                <div>
                    <ul className="flex gap-[10px]">
                        {sharedWith.map((user) => {
                            return <UserPil key={user.id} id={user.id} name={user.name} />
                        })}
                    </ul>
                </div>
            </div>
            <div className="flex items-center gap-[20px]">
                <button>Delete</button>
                <button>Finish</button>
            </div>
        </div>
    )
}

export default TaskCard