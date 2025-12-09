"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function RentRequestForm() {
  const [form, setForm] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@test.com",
    contact: "09123456789",
    delivery: "Manila",
    returnLocation: "Quezon City",
    startDate: "2024-12-10",
    startTime: "08:00",
    endDate: "2024-12-11",
    endTime: "17:00",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Submitting form", form);
  }

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name <span className="text-(--danger)">*</span></Label>
            <Input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div>
            <Label>Last Name <span className="text-(--danger)">*</span></Label>
            <Input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <Label>Email <span className="text-(--danger)">*</span></Label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <Label>Contact Information <span className="text-(--danger)">*</span></Label>
          <Input name="contact" value={form.contact} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Delivery Location <span className="text-(--danger)">*</span></Label>
            <Input name="delivery" value={form.delivery} onChange={handleChange} required />
          </div>
          <div>
            <Label>Return Location <span className="text-(--danger)">*</span></Label>
            <Input name="returnLocation" value={form.returnLocation} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date <span className="text-(--danger)">*</span></Label>
            <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </div>
          <div>
            <Label>Start Time <span className="text-(--danger)">*</span></Label>
            <Input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>End Date <span className="text-(--danger)">*</span></Label>
            <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>
          <div>
            <Label>End Time <span className="text-(--danger)">*</span></Label>
            <Input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <Label>Comment or Message</Label>
          <Textarea 
            name="message"
            className="mt-2 border-gray-300 focus:border-(--btn-primary) focus:ring-(--btn-primary) resize-none overflow-y-auto min-h-40 max-h-40" 
            placeholder="Write a message..."
            value={form.message} 
            onChange={handleChange} />
        </div>

        <Button type="submit" className="bg-(--btn-primary) hover:bg-(--nav-hover) text-white">Submit</Button>
      </form>
    </div>
  );
}
