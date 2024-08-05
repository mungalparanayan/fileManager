

import React, { useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faChevronDown, faChevronRight, faFile, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const FileData = ({
  explorer,
  handleInsertNode,
  handleDeleteNode,
  handleRenameNode,
  handleFileClick
}) => {
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });
  const [expand, setExpand] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  const handleNewItem = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const onAddItem = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
      setShowInput({ visible: false, isFolder: null });
    }
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const handleRename = () => {
    if (renaming && newName) {
      handleRenameNode(explorer.id, newName);
    }
    setRenaming(!renaming);
    if (!renaming) {
      setNewName(explorer.name);
    }
  };

  return (
    <div style={{ marginTop: 5, marginLeft: 10 }}>
      <div className="folder">
        {explorer.isFolder && explorer.items && explorer.items.length > 0 && (
          <span onClick={toggleExpand} style={{ cursor: 'pointer', marginRight: 5 }}>
            <FontAwesomeIcon icon={expand ? faChevronDown : faChevronRight} />
          </span>
        )}
        {renaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => !explorer.isFolder && handleFileClick(explorer.id)}>
            <FontAwesomeIcon icon={faFile} style={{ marginRight: 5 }} />
            {explorer.name}
          </span>
        )}
        <button onClick={handleRename}>
          <FontAwesomeIcon icon={faEdit} /> {renaming ? 'Save' : 'Rename'}
        </button>
        <button className="close" onClick={() => handleDeleteNode(explorer.id)}>
          <FontAwesomeIcon icon={faTrashAlt} /> Delete
        </button>
        {explorer.isFolder && (
          <div>
            <button onClick={(e) => handleNewItem(e, true)}><FontAwesomeIcon icon={faPlus} /> Folder </button>
            <button onClick={(e) => handleNewItem(e, false)}><FontAwesomeIcon icon={faPlus} /> File </button>
          </div>
        )}
      </div>
      <div style={{ display: expand ? 'block' : 'none', paddingLeft: 25 }}>
        {showInput.visible && (
          <div className="inputContainer">
            <FontAwesomeIcon icon={showInput.isFolder ? faFolder : faFile} />
            <input
              autoFocus
              onKeyDown={onAddItem}
              onBlur={() => setShowInput({ visible: false, isFolder: null })}
              type="text"
              className="inputContainer__input"
            />
          </div>
        )}
        {explorer.items && explorer.items.map((item) => (
          <FileData
            handleInsertNode={handleInsertNode}
            handleDeleteNode={handleDeleteNode}
            handleRenameNode={handleRenameNode}
            handleFileClick={handleFileClick}
            explorer={item}
            key={item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default FileData;

