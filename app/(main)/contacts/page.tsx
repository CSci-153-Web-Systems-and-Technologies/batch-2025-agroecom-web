import ContactForm from "./components/ContactForm";
import Header from "./components/Header";
import ContactDetails from "./components/ContactDetails";

export default function ContactsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="self-start"> 
                <ContactDetails />
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}