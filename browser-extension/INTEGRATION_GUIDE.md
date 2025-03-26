# Scratch编辑器操作记录器 — 与主应用集成指南

本文档详细说明如何将Scratch编辑器操作记录器浏览器扩展与您的主应用程序集成，以便接收和处理录制的操作数据。

## 目录

1. [集成概述](#集成概述)
2. [前端集成](#前端集成)
3. [后端集成](#后端集成)
4. [React应用集成](#react应用集成)
5. [数据格式说明](#数据格式说明)
6. [集成示例](#集成示例)

## 集成概述

Scratch编辑器操作记录器扩展通过以下两种方式向主应用发送数据：

1. **浏览器消息通信**：使用 `window.postMessage` API在扩展和主应用之间传递消息
2. **Chrome扩展消息通信**：使用 `chrome.tabs.sendMessage` API从扩展发送数据到主应用

为了接收这些数据，主应用需要实现相应的接收机制。我们提供了一个通用的接收器脚本 `main-app-receiver.js`，它能够处理两种通信方式并提供标准化的接口。

## 前端集成

### 步骤1：添加接收器脚本

将 `main-app-receiver.js` 文件添加到您的主应用程序中。有两种引入方式：

#### 方式1：直接通过HTML标签引入

```html
<script src="path/to/main-app-receiver.js"></script>
```

#### 方式2：通过模块系统导入（如webpack）

```javascript
import './path/to/main-app-receiver.js';
```

### 步骤2：实现数据处理函数

接收器脚本提供了多种方式来处理接收到的操作数据：

#### 使用全局事件监听

```javascript
window.addEventListener('scratch-operations-received', function(event) {
  const data = event.detail;
  console.log('收到的操作数量:', data.operations.length);
  console.log('录制时间:', data.duration, '秒');
  
  // 在这里处理操作数据，例如保存到状态管理器或发送到服务器
  saveOperationsToDatabase(data.operations);
});
```

#### 使用全局回调函数

```javascript
// 定义全局处理函数
window.handleScratchOperations = function(data) {
  console.log('收到Scratch操作数据:', data);
  
  // 在这里处理操作数据
  updateUIWithOperations(data.operations);
};
```

#### 使用提供的API手动获取数据

```javascript
// 获取最近一次录制的数据
const getLatestRecording = function() {
  const data = window.scratchOperationReceiver.getLastReceivedData();
  if (data) {
    console.log('最近一次录制:', data);
    return data;
  }
  return null;
};

// 手动导出数据到文件
document.getElementById('exportButton').addEventListener('click', function() {
  window.scratchOperationReceiver.exportDataToFile();
});
```

## 后端集成

要将操作数据永久保存，通常需要将数据发送到后端服务器。

### 发送数据到服务器

```javascript
window.addEventListener('scratch-operations-received', function(event) {
  const data = event.detail;
  
  // 发送数据到后端API
  fetch('/api/scratch-operations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('数据保存成功:', result);
  })
  .catch(error => {
    console.error('保存数据失败:', error);
  });
});
```

### 后端数据处理示例（Node.js）

```javascript
// Express路由示例
app.post('/api/scratch-operations', async (req, res) => {
  try {
    const data = req.body;
    
    // 验证数据
    if (!data.operations || !Array.isArray(data.operations)) {
      return res.status(400).json({ error: '无效的操作数据' });
    }
    
    // 保存到数据库
    const result = await db.collection('scratch_recordings').insertOne({
      operations: data.operations,
      recordedAt: new Date(data.recordedAt || Date.now()),
      duration: data.duration || 0,
      userId: req.user.id,  // 假设使用了用户认证
      metadata: {
        operationCount: data.operations.length,
        hasExecuteOperation: data.operations.some(op => op.type === 'executeCode')
      }
    });
    
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('保存操作数据失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});
```

## React应用集成

在React应用中集成操作记录器接收器需要一些特殊处理，以下是详细步骤：

### 创建接收器组件

```jsx
// ScratchReceiverComponent.jsx
import React, { useEffect } from 'react';
import '../path/to/main-app-receiver.js';

function ScratchReceiverComponent({ onOperationsReceived }) {
  useEffect(() => {
    // 监听操作数据事件
    const handleOperationsReceived = (event) => {
      const data = event.detail;
      if (onOperationsReceived) {
        onOperationsReceived(data);
      }
    };
    
    window.addEventListener('scratch-operations-received', handleOperationsReceived);
    
    // 清理函数
    return () => {
      window.removeEventListener('scratch-operations-received', handleOperationsReceived);
    };
  }, [onOperationsReceived]);
  
  return null; // 这是一个功能性组件，不需要渲染UI
}

export default ScratchReceiverComponent;
```

### 在应用中使用接收器组件

```jsx
// App.jsx
import React, { useState } from 'react';
import ScratchReceiverComponent from './ScratchReceiverComponent';

function App() {
  const [operations, setOperations] = useState([]);
  const [recordingInfo, setRecordingInfo] = useState(null);
  
  const handleOperationsReceived = (data) => {
    setOperations(data.operations || []);
    setRecordingInfo({
      recordedAt: data.recordedAt,
      duration: data.duration
    });
    
    // 可以在这里进行其他处理，如发送到服务器
    saveOperationsToServer(data);
  };
  
  return (
    <div className="app">
      {/* 引入接收器组件 */}
      <ScratchReceiverComponent onOperationsReceived={handleOperationsReceived} />
      
      {/* 显示操作数据 */}
      <div className="operations-panel">
        <h2>录制的操作 ({operations.length})</h2>
        {recordingInfo && (
          <div className="recording-info">
            <p>录制时间: {new Date(recordingInfo.recordedAt).toLocaleString()}</p>
            <p>时长: {recordingInfo.duration} 秒</p>
          </div>
        )}
        <ul className="operations-list">
          {operations.map((op, index) => (
            <li key={index} className={`operation-item operation-${op.type}`}>
              <span className="operation-time">{op.timestamp}s</span>
              <span className="operation-type">{op.type}</span>
              {op.blockId && <span className="operation-block-id">Block: {op.blockId}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function saveOperationsToServer(data) {
  // 实现保存逻辑...
}

export default App;
```

## 数据格式说明

### 操作数据结构

录制的操作数据遵循以下JSON格式：

```json
{
  "operations": [
    {
      "type": "操作类型",
      "timestamp": 时间戳（秒）,
      ...其他特定于操作类型的字段
    },
    ...更多操作
  ],
  "recordedAt": "ISO格式的日期时间字符串",
  "duration": 总录制时长（秒）
}
```

### 常见操作类型及其特有字段

1. **blockMove** - 积木移动操作
   - `blockId`: 积木ID
   - `startPosition`: 起始位置 `{x, y}`
   - `endPosition`: 结束位置 `{x, y}`

2. **executeCode** - 运行代码操作
   - `action`: 通常为 "运行程序"

3. **stopCode** - 停止代码操作
   - `action`: 通常为 "停止程序"

4. **clickBlock** - 点击积木操作
   - `blockId`: 积木ID
   - `position`: 点击位置 `{x, y}`

5. **selectCategory** - 选择积木类别操作
   - `category`: 类别名称

6. **blockAdd** - 添加积木操作
   - `blockId`: 新积木ID
   - `type`: 积木类型（如有）

7. **editBlockParam** - 编辑积木参数操作
   - `blockId`: 积木ID
   - `value`: 输入的值

8. **selectSprite** - 选择角色操作
   - `sprite`: 角色名称

9. **copy/paste/cut/undo/redo** - 编辑操作
   - `key`: 使用的快捷键（如 "Ctrl+C"）

## 集成示例

### 完整的HTML页面示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scratch操作记录查看器</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .operation-item {
      margin: 8px 0;
      padding: 8px;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .operation-blockMove { background-color: #e3f2fd; }
    .operation-executeCode { background-color: #e8f5e9; }
    .operation-stopCode { background-color: #ffebee; }
    .operation-time {
      display: inline-block;
      width: 60px;
      font-weight: bold;
    }
    .operation-type {
      margin-right: 10px;
      font-weight: bold;
    }
    .controls {
      margin: 20px 0;
    }
    button {
      padding: 8px 16px;
      margin-right: 10px;
      background-color: #4d97ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #3a86ff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Scratch操作记录查看器</h1>
    
    <div class="controls">
      <button id="exportBtn">导出最近录制</button>
      <button id="clearBtn">清除数据</button>
    </div>
    
    <div class="recording-info" id="recordingInfo">
      <!-- 录制信息将在这里显示 -->
    </div>
    
    <h2>操作列表</h2>
    <div id="operationsList">
      <!-- 操作列表将在这里显示 -->
    </div>
  </div>
  
  <!-- 引入接收器脚本 -->
  <script src="main-app-receiver.js"></script>
  
  <script>
    // 初始化页面
    document.addEventListener('DOMContentLoaded', function() {
      const operationsList = document.getElementById('operationsList');
      const recordingInfo = document.getElementById('recordingInfo');
      const exportBtn = document.getElementById('exportBtn');
      const clearBtn = document.getElementById('clearBtn');
      
      // 显示操作列表
      function displayOperations(data) {
        if (!data || !data.operations) return;
        
        // 显示录制信息
        const recordTime = new Date(data.recordedAt).toLocaleString();
        recordingInfo.innerHTML = `
          <p><strong>录制时间:</strong> ${recordTime}</p>
          <p><strong>时长:</strong> ${data.duration} 秒</p>
          <p><strong>操作数量:</strong> ${data.operations.length}</p>
        `;
        
        // 显示操作列表
        operationsList.innerHTML = '';
        data.operations.forEach(function(op) {
          const opElement = document.createElement('div');
          opElement.className = `operation-item operation-${op.type}`;
          
          let details = '';
          if (op.blockId) details += `BlockID: ${op.blockId} `;
          if (op.action) details += `动作: ${op.action} `;
          if (op.category) details += `类别: ${op.category} `;
          if (op.value) details += `值: ${op.value} `;
          
          opElement.innerHTML = `
            <span class="operation-time">${op.timestamp}s</span>
            <span class="operation-type">${op.type}</span>
            <span class="operation-details">${details}</span>
          `;
          
          operationsList.appendChild(opElement);
        });
      }
      
      // 监听从扩展接收的数据
      window.addEventListener('scratch-operations-received', function(event) {
        displayOperations(event.detail);
      });
      
      // 导出按钮点击事件
      exportBtn.addEventListener('click', function() {
        window.scratchOperationReceiver.exportDataToFile();
      });
      
      // 清除按钮点击事件
      clearBtn.addEventListener('click', function() {
        if (confirm('确定要清除所有显示的操作数据吗？')) {
          operationsList.innerHTML = '';
          recordingInfo.innerHTML = '';
        }
      });
      
      // 检查是否有最近的录制数据
      const lastData = window.scratchOperationReceiver.getLastReceivedData();
      if (lastData) {
        displayOperations(lastData);
      }
    });
  </script>
</body>
</html>
```

### Next.js应用集成示例

如果您使用的是Next.js框架，可以通过以下步骤集成操作记录器：

1. 创建一个客户端组件，用于加载接收器脚本：

```jsx
// components/ScratchReceiver.jsx
'use client';

import { useEffect, useRef } from 'react';

export default function ScratchReceiver({ onDataReceived }) {
  const initialized = useRef(false);
  
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // 动态加载脚本
    const script = document.createElement('script');
    script.src = '/js/main-app-receiver.js';
    script.async = true;
    document.body.appendChild(script);
    
    // 脚本加载完成后设置事件监听
    script.onload = () => {
      window.addEventListener('scratch-operations-received', (event) => {
        if (onDataReceived) {
          onDataReceived(event.detail);
        }
      });
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, [onDataReceived]);
  
  return null;
}
```

2. 在页面中使用该组件：

```jsx
// app/teacher/record/page.jsx
'use client';

import { useState } from 'react';
import ScratchReceiver from '@/components/ScratchReceiver';

export default function RecordPage() {
  const [operations, setOperations] = useState([]);
  const [recordingData, setRecordingData] = useState(null);
  
  const handleDataReceived = (data) => {
    setOperations(data.operations || []);
    setRecordingData({
      recordedAt: data.recordedAt,
      duration: data.duration
    });
    
    // 可以在这里添加保存逻辑
    console.log('收到操作数据，准备保存');
    
    // 这里可以集成之前的handleSaveOperations逻辑
    const recordingInfo = {
      lessonTitle: "Scratch录制课程",
      courseId: "scratch-course-1",
      recordedAt: new Date().toISOString(),
      duration: data.duration || 0,
      operations: data.operations || []
    };
    
    // 保存到本地或发送到服务器
    localStorage.setItem('lastRecording', JSON.stringify(recordingInfo));
  };
  
  return (
    <div className="record-page">
      <ScratchReceiver onDataReceived={handleDataReceived} />
      
      <h1>Scratch操作录制</h1>
      
      {recordingData && (
        <div className="recording-info">
          <p>录制时间: {new Date(recordingData.recordedAt).toLocaleString()}</p>
          <p>时长: {recordingData.duration} 秒</p>
          <p>操作数量: {operations.length}</p>
        </div>
      )}
      
      <div className="operations-container">
        <h2>录制的操作</h2>
        {operations.length === 0 ? (
          <p>暂无操作记录</p>
        ) : (
          <ul className="operations-list">
            {operations.map((op, index) => (
              <li key={index} className={`operation-${op.type}`}>
                <span>{op.timestamp}s</span> - 
                <strong>{op.type}</strong>
                {op.blockId && <span> (Block: {op.blockId})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

3. 确保将 `main-app-receiver.js` 文件放在 `public/js/` 目录下，以便Next.js能够正确提供该文件。 