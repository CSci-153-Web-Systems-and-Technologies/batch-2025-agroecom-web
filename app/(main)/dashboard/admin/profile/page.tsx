import PersonalInfo from '../../components/PersonalInfo'
import AccountInformation from '../../components/AccountInformation'
import ChangePassword from '../../components/ChangePassword'


export default function AdminProfile() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <PersonalInfo />
        <AccountInformation />
      </div>
      <div className="lg:col-span-1">
        <ChangePassword />
      </div>
    </div>
  );
}