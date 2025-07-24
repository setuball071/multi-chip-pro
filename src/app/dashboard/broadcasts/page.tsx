"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Clock, PlusCircle, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function BroadcastsPage() {
  const [variations, setVariations] = React.useState(['Hi!', 'Hello', 'Hey there']);
  const [newVariation, setNewVariation] = React.useState('');

  const addVariation = () => {
    if (newVariation.trim()) {
      setVariations([...variations, newVariation.trim()]);
      setNewVariation('');
    }
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };


  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-headline tracking-tight">New Broadcast</h2>
        <p className="text-muted-foreground">Schedule a new mass message campaign.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Message Content</CardTitle>
            <CardDescription>Define the message and its variations to avoid spam filters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label htmlFor="base-message">Base Message (Optional)</Label>
                <Textarea id="base-message" placeholder="e.g., Hope you're having a great day!" className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">This text can be included in all variations.</p>
            </div>
            <Separator />
            <div>
              <Label>Text Variations</Label>
              <p className="text-xs text-muted-foreground mb-2">One of these will be randomly chosen for each message.</p>
              <div className="space-y-2">
                {variations.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={v} readOnly className="bg-muted/50" />
                    <Button variant="ghost" size="icon" onClick={() => removeVariation(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  placeholder="Add a new variation"
                  value={newVariation}
                  onChange={(e) => setNewVariation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addVariation()}
                 />
                <Button onClick={addVariation}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Scheduling &amp; Delivery</CardTitle>
            <CardDescription>Configure how and when your message will be sent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Use All SIMs</Label>
                    <p className="text-xs text-muted-foreground">Broadcast from all active SIMs.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="space-y-2">
              <Label htmlFor="delay">Programmable Delay (seconds)</Label>
              <Input id="delay" type="number" defaultValue="5" />
              <p className="text-xs text-muted-foreground">Delay between messages from different SIMs.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="schedule">Schedule Time (Optional)</Label>
              <Input id="schedule" type="datetime-local" />
               <p className="text-xs text-muted-foreground">Leave blank to send immediately.</p>
            </div>
          </CardContent>
           <CardFooter>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Launch Broadcast
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
