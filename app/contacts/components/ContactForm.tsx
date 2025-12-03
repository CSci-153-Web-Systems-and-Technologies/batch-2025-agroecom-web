"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToastId = toast.loading("Sending your message...");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.dismiss(loadingToastId);
      toast.success("Message Sent!", {
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });

    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToastId);
      toast.error("Failed to send message", {
        description: "Please try again later or contact us directly at agroecom@gmail.com",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="border">
        <CardTitle className="inline-flex justify-start font-semibold px-6">
            Contact Form:
        </CardTitle>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700">
                  Name <span className="text-(--danger)">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-(--btn-primary)] focus:ring-(--btn-primary)"
                    />
                  </div>
                  <div>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-(--btn-primary) focus:ring-(--btn-primary)"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email <span className="text-(--danger)">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 border-gray-300 focus:border-(--btn-primary) focus:ring-(--btn-primary)"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-700">
                  Comment or Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="mt-2 border-gray-300 focus:border-(--btn-primary)] focus:ring-(--btn-primary)] resize-none overflow-y-auto min-h-[120px] max-h-[120px]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-semibold py-6"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}