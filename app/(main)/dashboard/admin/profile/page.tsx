import PersonalInfo from '../../components/PersonalInfo'
import AccountInformation from '../../components/AccountInformation'

export default function AdminProfile() {
  return (
    <div className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6">

      <PersonalInfo />
      <AccountInformation />
      
    </div>
  );
}