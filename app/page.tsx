"use client";

import { Todo } from "./components/Todo";
import type { TodoType } from "./types/TodoType";
import React, { useRef, useState } from "react";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const inputTodoRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const reqBody = {
      title: inputTodoRef.current?.value,
      isCompleted: false
    } 
    const response = await fetch(`http://localhost:8080/createtodo`,{
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(reqBody)
    });
    if (response.ok) {
      const newTodo = await response.json(); 
      console.log(`作成: {id: ${newTodo.id}, title:${newTodo.title}}`) ;
      mutate([...todos, newTodo], true);
      if(inputTodoRef.current !== null){
        inputTodoRef.current.value = "";
      }
    }
  };

  const { todos, isLoading, error, mutate} = useTodos();

  return (
    <div
      className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4"
    >
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
      </div>
      <form
        className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent
          border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight
          focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputTodoRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo:TodoType) => (
          <Todo key={todo.id} todo={todo}/>
        ))}
      </ul>
    </div>
  );
}
