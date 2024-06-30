import React, { useState } from "react";
import type { TodoType } from "../types/TodoType";
import { useTodos } from "@/hooks/useTodos";

type TodoProps = {
    todo: TodoType;
}

export const Todo = ({ todo }:TodoProps) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>(todo.title);
    const { todos, isLoading, error, mutate} = useTodos();

    const updateTodo = async(todoProperty:TodoType) => {
        const response = await fetch("http://localhost:8080/updatetodo",{
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(todoProperty)
        });

        if (response.ok) {
            const updatedTodo = await response.json();
            console.log(`更新：
                タイトル${todo.title} => ${updatedTodo.title}
                完了状態${todo.isCompleted} => ${updatedTodo.isCompleted}
                `);
            const updatedTodos = todos.map((_todo:TodoType) => _todo.id === updatedTodo.id ? updatedTodo : _todo);
            mutate(updatedTodos, true);
        }

}
    const editTodo =  async() => {
        if (isEditMode) {
            const reqBody = {
                id: todo.id,
                title: editedTitle,
                isCompleted: todo.isCompleted
            };

            updateTodo(reqBody);

        }
        setIsEditMode(!isEditMode);
    }

    const deleteTodo = async() => {
        const reqBody = {
            id: todo.id
        };
        const response = await fetch(
            "http://localhost:8080/deletetodo",
            {
                method:"DELETE",
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            }
        );
        if(response.ok){
            const deletedTodo:TodoType = await response.json();
            console.log(`${deletedTodo.title}を削除しました。`);
            mutate(todos.filter((todo:TodoType) => todo.id !== deletedTodo.id));
        }    
    }
    
    const toggleTodoCompletion = () => {
        const reqBody:TodoType = {
            id: todo.id,
            title: todo.title,
            isCompleted: !todo.isCompleted
        };
        updateTodo(reqBody);
    };

    return (        
        <div>
            <li className="py-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                <input
                    id="todo1"
                    name="todo1"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500
                        border-gray-300 rounded"
                    checked={todo.isCompleted}
                    onChange={toggleTodoCompletion}
                />
                <label className="ml-3 block text-gray-900">
                    {isEditMode
                        ? ( <input type="text" className="border rounded py-1 px-2" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/> )
                        : ( <span className={`text-lg font-medium mr-2 ${todo.isCompleted ? "line-through" : ""} `} > {todo.title} </span>) 
                    }
                </label>
                </div>
                <div className="flex items-center space-x-2">
                <button
                    className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
                    onClick={editTodo}
                >
                   {isEditMode ? "💾" : "✒"} 
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
                    onClick={deleteTodo}
                >
                    ✖
                </button>
                </div>
                </div>
            </li>
        </div>
    )
}