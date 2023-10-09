import React, { useState, useEffect } from 'react';
import { db } from "./firebase-config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import './App.css';

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null); // Track the user being edited
  const userCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(userCollectionRef, { Name: newName, Age: Number(newAge) });
    setNewName("");
    setNewAge(0);
    getUsers();
  };

  const updateUser = async (id, Age) => {
    const userDoc = doc(db, "users", id);
    const newField = { Age: Age + 1 };
    await updateDoc(userDoc, newField);
    getUsers();
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers();
  };

  const editUser = (id) => {
    setEditUserId(id);
  };

  const saveEditedUser = async (id, newName) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { Name: newName });
    setEditUserId(null); // Exit edit mode
    getUsers();
  };

  const cancelEdit = () => {
    setEditUserId(null); // Exit edit mode without saving changes
  };

  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="App">
      <div className="input-container">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          value={newAge}
          onChange={(event) => setNewAge(event.target.value)}
        />
        <button onClick={createUser}>Create User</button>
      </div>
      <div className="user-container">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            {editUserId === user.id ? (
              <div className="user-info">
                <input
                  type="text"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                />
                <button onClick={() => saveEditedUser(user.id, newName)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className="user-info">
                <div><strong>Name:</strong> {user.Name}</div>
                <div><strong>Age:</strong> {user.Age}</div>
              </div>
            )}
            <div className="user-buttons">
              <button className="increase-age-button" onClick={() => updateUser(user.id, user.Age)}>
                Increase Age
              </button>
              {editUserId !== user.id && (
                <button className="edit-user-button" onClick={() => editUser(user.id)}>
                  Edit User
                </button>
              )}
              <button className="delete-user-button" onClick={() => deleteUser(user.id)}>
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
