import AdminShell from "@/components/AdminShell";
import FormField from "@/components/FormField";

// logged-in Ticket-IT admin's own account page, same form design as New-Frontend YourAccount (design only)
export default function YourAccountPage() {
  return (
    <AdminShell>
      <div className="detail-page-topbar">
        <div>
          <h2 className="subpage-title">Your Account</h2>
          <p className="page-subtitle">
            Update your profile details, contact information and password.
          </p>
        </div>
      </div>

      <main className="flex flex-col gap-4 p-4">
        <section className="card">
          <form className="form-grid" autoComplete="off" action="#">
            <FormField label="Username" name="login" defaultValue="admin" disabled />
            <FormField label="Email" name="email" type="email" defaultValue="admin@ticket-it.com" />
            <FormField label="First Name" name="firstName" defaultValue="Ticket-IT" />
            <FormField label="Last Name" name="lastName" defaultValue="Admin" />
            <FormField label="Phone" name="phone" defaultValue="0400 000 000" />
            <FormField label="Address Line 1" name="addressLine1" defaultValue="Level 1, 100 Example Street" />
            <FormField label="Address Line 2" name="addressLine2" defaultValue="Sydney NSW 2000" />
            <FormField label="Current Password" name="currentPassword" type="password" />
            <FormField label="Change Password" name="changePassword" type="password" />
            <FormField label="Confirm New Password" name="confirmPass" type="password" />

            <div className="form-actions">
              <button type="button" className="cta_with_icon mint-bg">
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>
                <p>Submit</p>
              </button>
            </div>
          </form>
        </section>
      </main>
    </AdminShell>
  );
}
