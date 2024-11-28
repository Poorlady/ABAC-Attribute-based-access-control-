import React from 'react'
import { UserData } from '../user-pil'
import TaskCard from '../task-card'

export type TaskData = {
    id: number,
    title: string,
    isFinished: boolean,
    author: UserData,
    sharedWith: UserData[]
}

const tasks: TaskData[] = [
    {
        id: 1,
        title: "Task 1",
        isFinished: false,
        author: {
            name: "User 1",
            id: 1
        },
        sharedWith: []
    },
    {
        id: 2,
        title: "Task 2",
        isFinished: true,
        author: {
            name: "User 1",
            id: 1
        },
        sharedWith: [
            {
                name: 'User 2',
                id: 2
            },
            {
                name: "User 3",
                id: 3
            }
        ]
    },
    {
        id: 3,
        title: "Task 3",
        isFinished: false,
        author: {
            name: "User 2",
            id: 2
        },
        sharedWith: []
    },
    {
        id: 4,
        title: "Task 4",
        isFinished: false,
        author: {
            name: "User 3",
            id: 3
        },
        sharedWith: [
            {
                name: "User 2",
                id: 2
            }
        ]
    },

]

const TaskPage = () => {
    return (
        <main className="p-[50px]">
            <div>
                <p className="text-left text-[20px] leading-[24px] mb-[10px]">Welcome, User 3</p>
                <p className="mb-[20px]">Your Task List:</p>
                <ol className='flex flex-col gap-[20px]'>
                    {tasks.map(task => {
                        return <TaskCard
                            id={task.id}
                            key={task.id}
                            sharedWith={task.sharedWith}
                            title={task.title}
                            author={task.author}
                            isFinished={task.isFinished}
                        />
                    })}
                </ol>
            </div>
        </main>
    )
}

export default TaskPage