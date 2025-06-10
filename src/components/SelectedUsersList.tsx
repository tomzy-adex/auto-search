import React from "react";

type Props = {
  users: any[];
  onClear: () => void;
};

const SelectedUsersList: React.FC<Props> = ({ users, onClear }) => (
  <div style={{ marginTop: "20px" }}>
    <h4>Selected Users:</h4>
    <ul style={{ paddingLeft: "16px" }}>
      {users.map((user) => (
        <li key={user.id}>
          {user.firstName} {user.lastName}
        </li>
      ))}
    </ul>
    <button
      onClick={onClear}
      style={{
        marginTop: "10px",
        padding: 10,
        backgroundColor: "red",
        color: "white",
        border: 0,
        borderRadius: 8,
      }}
    >
      Clear All
    </button>
  </div>
);

export default SelectedUsersList;
