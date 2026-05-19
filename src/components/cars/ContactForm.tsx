import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  request_type: z.enum(['info', 'test_drive']),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  carId?: string;
  carName?: string;
}

export function ContactForm({ carId, carName }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      request_type: 'info',
      message: carName ? `I'm interested in the ${carName}. ` : '',
    },
  });

  const requestType = watch('request_type');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_requests').insert({
        car_id: carId || null,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        request_type: data.request_type,
      });

      if (error) throw error;

      toast.success(
        data.request_type === 'test_drive'
          ? "Test drive request submitted! We'll contact you shortly."
          : "Message sent! We'll get back to you soon."
      );
      reset();
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label className="text-sm font-medium">What can we help you with?</Label>
        <RadioGroup
          defaultValue="info"
          onValueChange={(value) => setValue('request_type', value as 'info' | 'test_drive')}
          className="mt-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="info" id="info" />
            <Label htmlFor="info" className="cursor-pointer font-normal">
              Request Information
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="test_drive" id="test_drive" />
            <Label htmlFor="test_drive" className="cursor-pointer font-normal">
              Schedule Test Drive
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="John Doe"
            className="mt-1.5"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            className="mt-1.5"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="(123) 456-7890"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder={
            requestType === 'test_drive'
              ? 'Let us know your preferred date and time for the test drive...'
              : 'Tell us what you would like to know...'
          }
          rows={4}
          className="mt-1.5"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {requestType === 'test_drive' ? 'Request Test Drive' : 'Send Message'}
      </Button>
    </form>
  );
}
