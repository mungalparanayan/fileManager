


import './App.css';
import { useState, useEffect } from 'react';
import FileData from './components/Filedata';
import Modal from './components/Modal';

function App() {
  const initialExplorer = {
    id: '1',
    name: 'root',
    isFolder: true,
    items: [],
  };

  const [explorerData, setExplorerData] = useState(() => {
    const savedData = localStorage.getItem('explorerData');
    return savedData ? JSON.parse(savedData) : initialExplorer;
  });

  const [idCounter, setIdCounter] = useState(() => {
    const savedCounter = localStorage.getItem('idCounter');
    return savedCounter ? parseInt(savedCounter, 10) : 2;
  });

  const [fileContents, setFileContents] = useState(() => {
    const savedContents = localStorage.getItem('fileContents');
    return savedContents ? JSON.parse(savedContents) : {};
  });

  useEffect(() => {
    localStorage.setItem('explorerData', JSON.stringify(explorerData));
  }, [explorerData]);

  useEffect(() => {
    localStorage.setItem('idCounter', idCounter.toString());
  }, [idCounter]);

  useEffect(() => {
    localStorage.setItem('fileContents', JSON.stringify(fileContents));
  }, [fileContents]);

  const handleInsertNode = (folderId, itemName, isFolder) => {
    const addNewItem = (items, folderId, newItem) => {
      return items.map((item) => {
        if (item.id === folderId && item.isFolder) {
          return { 
            ...item, 
            items: item.items ? [...item.items, newItem] : [newItem] 
          };
        } else if (item.isFolder) {
          return { 
            ...item, 
            items: addNewItem(item.items ? item.items : [], folderId, newItem) 
          };
        }
        return item;
      });
    };

    const newExplorerData = {
      ...explorerData,
      items: addNewItem(explorerData.items ? explorerData.items : [], folderId, {
        id: idCounter.toString(),
        name: itemName,
        isFolder,
        items: isFolder ? [] : undefined,
      }),
    };

    setIdCounter(idCounter + 1);
    setExplorerData(newExplorerData);
  };

  const handleDeleteNode = (nodeId) => {
    const deleteNode = (items, nodeId) => {
      return items
        .filter((item) => item.id !== nodeId)
        .map((item) => (item.isFolder ? { ...item, items: deleteNode(item.items, nodeId) } : item));
    };

    const newExplorerData = {
      ...explorerData,
      items: deleteNode(explorerData.items ? explorerData.items : [], nodeId),
    };

    setExplorerData(newExplorerData);

    const newFileContents = { ...fileContents };
    delete newFileContents[nodeId];
    setFileContents(newFileContents);
  };

  const handleRenameNode = (nodeId, newName) => {
    const renameNode = (items, nodeId, newName) => {
      return items.map((item) => {
        if (item.id === nodeId) {
          return { ...item, name: newName };
        }
        if (item.isFolder) {
          return { ...item, items: renameNode(item.items, nodeId, newName) };
        }
        return item;
      });
    };

    const newExplorerData = {
      ...explorerData,
      items: renameNode(explorerData.items ? explorerData.items : [], nodeId, newName),
    };

    setExplorerData(newExplorerData);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [currentFileContent, setCurrentFileContent] = useState('');
  const [currentFileId, setCurrentFileId] = useState('');

  const handleFileClick = (fileId) => {
    setCurrentFileContent(fileContents[fileId] || '');
    setCurrentFileId(fileId);
    setModalOpen(true);
  };

  const handleSaveFile = (content) => {
    const newFileContents = {
      ...fileContents,
      [currentFileId]: content,
    };

    setFileContents(newFileContents);
    setModalOpen(false);
  };

  return (
    <div>
      <FileData
        explorer={explorerData}
        handleInsertNode={handleInsertNode}
        handleDeleteNode={handleDeleteNode}
        handleRenameNode={handleRenameNode}
        handleFileClick={handleFileClick}
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveFile}
        initialContent={currentFileContent}
      />
    </div>
  );
}

const findFileById = (data, id) => {
  if (!data || !data.items) return null;

  for (let item of data.items) {
    if (item.id === id) {
      return item;
    }
    if (item.isFolder) {
      const found = findFileById(item, id);
      if (found) return found;
    }
  }
  return null;
};

export default App;

