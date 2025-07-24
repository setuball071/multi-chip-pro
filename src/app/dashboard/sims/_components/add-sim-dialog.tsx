"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function AddSimDialog() {
    const { toast } = useToast();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // In a real app, you would handle form submission here
        toast({
            title: "SIM Registered",
            description: "The new SIM card has been added to your inventory.",
        });
        // Here you would typically close the dialog, which needs state management.
        // For this example, we just show a toast.
    };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add SIM
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle className="font-headline">Register New SIM</DialogTitle>
            <DialogDescription>
                Add a new SIM card to your inventory. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Internal Name
                </Label>
                <Input id="name" defaultValue="Campaign Charlie" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                Phone Number
                </Label>
                <Input id="phone" defaultValue="+1 (555) 890-1234" className="col-span-3" />
            </div>
            </div>
            <DialogFooter>
            <Button type="submit">Save SIM</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
