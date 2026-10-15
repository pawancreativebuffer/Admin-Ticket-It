"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import FormField from "@/components/FormField";
import { headOffice, regionalManagers, franchisees } from "@/data/users";

const ALL_USERS = [...headOffice, ...regionalManagers, ...franchisees];
const ZONES = ["Zone 1", "Zone 2", "Zone 3"];

// edit form for the user picked in the table (?user=username); design only, submit does nothing
function EditAccountForm() {
  const username = useSearchParams().get("user") ?? ALL_USERS[0].username;
  const user = ALL_USERS.find((row) => row.username === username) ?? ALL_USERS[0];
  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <>
      <div className="detail-page-topbar">
        <div>
          <ul className="breadcrumb-items">
            <li>
              <Link href="/">User Administration</Link>
            </li>
            <li>Edit Account</li>
          </ul>
          <div className="global-back-button">
            <Link href="/">
              <span>
                <i className="fa-solid fa-arrow-left"></i> Go Back
              </span>
            </Link>
            Edit Account
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4 p-4">
        <section className="card">
          <form
            className="form-grid"
            autoComplete="off"
            onSubmit={(event) => event.preventDefault()}
          >
            <FormField label="Username" name="login" defaultValue={user.username} disabled />
            <FormField label="Email" name="email" type="email" defaultValue={user.email} />
            <FormField label="First Name" name="firstName" defaultValue={firstName} />
            <FormField label="Last Name" name="lastName" defaultValue={lastName} />
            <FormField label="Phone" name="phone" defaultValue="123456789" />
            <FormField label="Address Line 1" name="addressLine1" defaultValue="Address3" />
            <FormField label="Address Line 2" name="addressLine2" defaultValue="" />
            <FormField label="Current Password" name="currentPassword" type="password" />
            <FormField label="Change Password" name="changePassword" type="password" />
            <FormField label="Confirm New Password" name="confirmPass" type="password" />
            <FormField
              label="Tags"
              name="tags"
              placeholder="Add multiple tags by separated comma"
            />
            <FormField
              label="Store Category"
              name="storeCategory"
              defaultValue={user.storeCategory}
              placeholder="Add multiple category by separated comma"
            />
            <FormField
              label="Group"
              name="groupName"
              defaultValue={user.group}
              placeholder="Add multiple group by separated comma"
            />
            <div className="custom-field">
              <label className="field-label" htmlFor="zone">
                Zoning
              </label>
              <div className="field-type field-stype-select">
                <select id="zone" name="zone" defaultValue={ZONES[0]}>
                  {ZONES.map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="cta_with_icon mint-bg">
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>
                <p>Update</p>
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default function EditUserPage() {
  return (
    <AdminShell>
      <Suspense fallback={null}>
        <EditAccountForm />
      </Suspense>
    </AdminShell>
  );
}
