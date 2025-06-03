"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "@/components/task/TaskList";
import ChatBox from "@/components/chat/ChatBox";
import { useTaskStore } from "@/hooks/store/useTaskStore";
import { useChatStore } from "@/hooks/store/useChatStore";
import Link from "next/link";
import { FaTasks, FaHome } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/types";

export default function TaskPage() {
  const [isTaskListVisible, setIsTaskListVisible] = useState(false);
  const { tasks, setTasks, selectedTaskId, setSelectedTaskId } = useTaskStore();
  const { setMessages } = useChatStore();

  // 检测是否为移动设备
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsTaskListVisible(!isMobile);
  }, []);

  // 自动选中最新创建的任务
  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      const latestTask = tasks.reduce((latest, current) => {
        return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
      });
      setSelectedTaskId(latestTask.id);
    }
  }, [tasks, selectedTaskId, setSelectedTaskId]);

  const handleTaskSelect = (taskId: string | null) => {
    if (taskId === null) {
      // 创建新任务
      const newTask: Task = {
        id: uuidv4(),
        title: "New Task",
        description: "Click to edit task details",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      setSelectedTaskId(newTask.id);
      setMessages([]);
    } else {
      setSelectedTaskId(taskId);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setMessages([]);
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task));
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <FaTasks className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Task Manager</h1>
          </div>
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <FaHome className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="relative pt-16">
        <AnimatePresence>
          {isTaskListVisible && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-16 left-0 w-80 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-md border-r border-gray-800 z-50"
            >
              <TaskList
                tasks={tasks}
                selectedTaskId={selectedTaskId}
                onTaskSelect={handleTaskSelect}
                onTaskDelete={handleTaskDelete}
                onTaskUpdate={handleTaskUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 收缩按钮 */}
        <button
          onClick={() => setIsTaskListVisible(!isTaskListVisible)}
          className="fixed left-4 top-20 z-50 p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isTaskListVisible ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>

        <motion.div
          className={`h-[calc(100vh-4rem)] transition-all duration-300 ${
            isTaskListVisible ? "md:ml-80" : ""
          }`}
        >
          <ChatBox />
        </motion.div>
      </div>
    </div>
  );
}
