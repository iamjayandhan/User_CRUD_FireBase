import React, { useState, useEffect } from 'react';
import { db } from "./firebase-config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import './App.css';

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState();
  const [newRole, setNewRole] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState(0);
  const [editRole, setEditRole] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const userCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(userCollectionRef, { Name: newName, Age: Number(newAge), Role: newRole, Description: newDescription });
    setNewName("");
    setNewAge(0);
    setNewRole("");
    setNewDescription("");
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
    const selectedUser = users.find((user) => user.id === id);
    if (selectedUser) {
      setEditName(selectedUser.Name);
      setEditAge(selectedUser.Age);
      setEditRole(selectedUser.Role);
      setEditDescription(selectedUser.Description);
    }
  };

  const saveEditedUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, {
      Name: editName,
      Age: Number(editAge),
      Role: editRole,
      Description: editDescription,
    });
    setEditUserId(null);
    getUsers();
  };

  const cancelEdit = () => {
    setEditUserId(null);
  };

  const copyUserInfo = (user) => {
    const userInfoText = `Name: ${user.Name}\nAge: ${user.Age}\nRole: ${user.Role}\nDescription: ${user.Description}`;
    
    navigator.clipboard.writeText(userInfoText)
      .then(() => {
        alert('User information copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy user information: ', err);
        alert('Failed to copy user information');
      });
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
      <h1>User CRUD Management</h1>
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
        <label htmlFor="role">Role:</label>
        <input
          id="role"
          type="text"
          value={newRole}
          onChange={(event) => setNewRole(event.target.value)}
        />
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          type="text"
          value={newDescription}
          onChange={(event) => setNewDescription(event.target.value)}
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
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                />
                <input
                  type="number"
                  value={editAge}
                  onChange={(event) => setEditAge(event.target.value)}
                />
                <input
                  type="text"
                  value={editRole}
                  onChange={(event) => setEditRole(event.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                />
                <button onClick={() => saveEditedUser(user.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className="user-info">
                <div><strong>Name:</strong> {user.Name}</div>
                <div><strong>Age:</strong> {user.Age}</div>
                <div><strong>Role:</strong> {user.Role}</div>
                <div><strong>Description:</strong> {user.Description}</div>
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
              <button className="copy-user-info-button" onClick={() => copyUserInfo(user)}>
                  Copy {/* FontAwesome copy icon */}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
