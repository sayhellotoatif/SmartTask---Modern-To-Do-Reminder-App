import * as SQLite from 'expo-sqlite';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
}

class TaskServiceClass {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase() {
    try {
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync('smarttask.db');
        
        await this.db.execAsync(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            dueDate TEXT NOT NULL,
            priority TEXT NOT NULL,
            isCompleted INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL
          );
        `);
        
        console.log('Database initialized successfully');
      }
      return this.db;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskData): Promise<string> {
    const db = await this.initDatabase();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();

    try {
      await db.runAsync(
        `INSERT INTO tasks (id, title, description, dueDate, priority, isCompleted, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          taskData.title,
          taskData.description,
          taskData.dueDate,
          taskData.priority,
          taskData.isCompleted ? 1 : 0,
          createdAt
        ]
      );

      console.log('Task created successfully:', id);
      return id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getAllTasks(): Promise<Task[]> {
    const db = await this.initDatabase();

    try {
      const result = await db.getAllAsync('SELECT * FROM tasks ORDER BY createdAt DESC');
      
      return result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        dueDate: row.dueDate,
        priority: row.priority as Priority,
        isCompleted: row.isCompleted === 1,
        createdAt: row.createdAt,
      }));
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    const db = await this.initDatabase();

    try {
      const result = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [id]);
      
      if (!result) {
        return null;
      }

      return {
        id: result.id,
        title: result.title,
        description: result.description || '',
        dueDate: result.dueDate,
        priority: result.priority as Priority,
        isCompleted: result.isCompleted === 1,
        createdAt: result.createdAt,
      } as Task;
    } catch (error) {
      console.error('Error getting task by id:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<CreateTaskData>): Promise<void> {
    const db = await this.initDatabase();

    try {
      const setClauses = [];
      const values = [];

      if (updates.title !== undefined) {
        setClauses.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        setClauses.push('description = ?');
        values.push(updates.description);
      }
      if (updates.dueDate !== undefined) {
        setClauses.push('dueDate = ?');
        values.push(updates.dueDate);
      }
      if (updates.priority !== undefined) {
        setClauses.push('priority = ?');
        values.push(updates.priority);
      }
      if (updates.isCompleted !== undefined) {
        setClauses.push('isCompleted = ?');
        values.push(updates.isCompleted ? 1 : 0);
      }

      if (setClauses.length === 0) {
        return;
      }

      values.push(id);

      await db.runAsync(
        `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );

      console.log('Task updated successfully:', id);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    const db = await this.initDatabase();

    try {
      await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
      console.log('Task deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async searchTasks(query: string): Promise<Task[]> {
    const db = await this.initDatabase();

    try {
      const result = await db.getAllAsync(
        'SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ? ORDER BY createdAt DESC',
        [`%${query}%`, `%${query}%`]
      );

      return result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        dueDate: row.dueDate,
        priority: row.priority as Priority,
        isCompleted: row.isCompleted === 1,
        createdAt: row.createdAt,
      }));
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  async getTasksByPriority(priority: Priority): Promise<Task[]> {
    const db = await this.initDatabase();

    try {
      const result = await db.getAllAsync(
        'SELECT * FROM tasks WHERE priority = ? ORDER BY createdAt DESC',
        [priority]
      );

      return result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        dueDate: row.dueDate,
        priority: row.priority as Priority,
        isCompleted: row.isCompleted === 1,
        createdAt: row.createdAt,
      }));
    } catch (error) {
      console.error('Error getting tasks by priority:', error);
      throw error;
    }
  }

  async getCompletedTasks(): Promise<Task[]> {
    const db = await this.initDatabase();

    try {
      const result = await db.getAllAsync(
        'SELECT * FROM tasks WHERE isCompleted = 1 ORDER BY createdAt DESC'
      );

      return result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        dueDate: row.dueDate,
        priority: row.priority as Priority,
        isCompleted: row.isCompleted === 1,
        createdAt: row.createdAt,
      }));
    } catch (error) {
      console.error('Error getting completed tasks:', error);
      throw error;
    }
  }

  async exportTasks(): Promise<string> {
    try {
      const tasks = await this.getAllTasks();
      return JSON.stringify(tasks, null, 2);
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw error;
    }
  }

  async importTasks(jsonData: string): Promise<void> {
    try {
      const tasks: Task[] = JSON.parse(jsonData);
      
      for (const task of tasks) {
        await this.createTask({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          isCompleted: task.isCompleted,
        });
      }

      console.log('Tasks imported successfully');
    } catch (error) {
      console.error('Error importing tasks:', error);
      throw error;
    }
  }
}

export const TaskService = new TaskServiceClass();