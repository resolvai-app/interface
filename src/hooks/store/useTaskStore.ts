"use client";
import { Task } from "@/types";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  setTasks: (tasks: Task[]) => void;
  setSelectedTaskId: (taskId: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTaskId: null,
  setTasks: (tasks) => {
    set({ tasks });
    // 只在客户端保存到 localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  },
  setSelectedTaskId: (taskId) => {
    set({ selectedTaskId: taskId });
    // 只在客户端保存到 localStorage
    if (typeof window !== "undefined") {
      if (taskId) {
        localStorage.setItem("selectedTaskId", taskId);
      } else {
        localStorage.removeItem("selectedTaskId");
      }
    }
  },
}));

// 在客户端初始化时加载数据
if (typeof window !== "undefined") {
  const savedTasks = localStorage.getItem("tasks");
  const savedSelectedTaskId = localStorage.getItem("selectedTaskId");

  if (savedTasks) {
    useTaskStore.getState().setTasks(JSON.parse(savedTasks));
  }

  if (savedSelectedTaskId) {
    useTaskStore.getState().setSelectedTaskId(savedSelectedTaskId);
  }
}
