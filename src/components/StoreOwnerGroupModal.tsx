"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";

export type StoreOwnerGroup = {
  name: string;
  manager: string;
  users: string[];
};

// "Create / Edit Store Owner Group" popup from the legacy page:
// name, a manager picked from the head office users, and the store users in the group
export default function StoreOwnerGroupModal({
  group,
  managers,
  storeUsers,
  onSave,
  onClose,
}: {
  group?: StoreOwnerGroup;
  managers: string[];
  storeUsers: string[];
  onSave: (group: StoreOwnerGroup) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(group?.name ?? "");
  const [manager, setManager] = useState(group?.manager ?? managers[0] ?? "");
  const [users, setUsers] = useState<Set<string>>(new Set(group?.users ?? []));

  const toggleUser = (user: string) =>
    setUsers((current) => {
      const next = new Set(current);
      if (next.has(user)) next.delete(user);
      else next.add(user);
      return next;
    });

  return (
    <Modal
      title={group ? `Edit Store Owner Group` : "Create Store Owner Group"}
      onClose={onClose}
      width={640}
    >
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() === "") return;
          onSave({
            name: name.trim(),
            manager,
            users: storeUsers.filter((user) => users.has(user)),
          });
        }}
      >
        <div className="form-grid one">
          <FormField
            label="Name"
            name="store-group-name"
            defaultValue={name}
            placeholder="Group name"
            onChange={setName}
          />

          <div className="custom-field">
            <label className="field-label" htmlFor="store-group-manager">
              Store Group Manager
            </label>
            <div className="field-type field-stype-select">
              <select
                id="store-group-manager"
                value={manager}
                onChange={(event) => setManager(event.target.value)}
              >
                {managers.map((user) => (
                  <option key={user}>{user}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>

          <div className="custom-field">
            <span className="field-label">Store Group Users</span>
            <div className="zonal-list one">
              {storeUsers.map((user) => (
                <label key={user} className="check-row">
                  <input
                    type="checkbox"
                    checked={users.has(user)}
                    onChange={() => toggleUser(user)}
                  />
                  <span>{user}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions end">
          <button
            type="submit"
            className="cta_with_icon mint-bg"
            disabled={name.trim() === ""}
          >
            <span>
              <i className="fa-solid fa-check"></i>
            </span>
            <p>Save Group</p>
          </button>
        </div>
      </form>
    </Modal>
  );
}
