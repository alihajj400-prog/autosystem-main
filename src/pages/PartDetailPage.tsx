import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageCircle, Phone, Package } from 'lucide-react';
import { usePart } from '@/hooks/useParts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { BUSINESS } from '@/lib/constants';

export default function PartDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: part, isLoading, error } = usePart(id || '');

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Link to="/parts" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Parts & Screens
        </Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${part.name} listed on Autosystem.`
  );

  return (
    <div className="animate-fade-in py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/parts"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Parts & Screens
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {part.images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {part.images.map((img, i) => (
                  <div
                    key={i}
                    className={`overflow-hidden rounded-xl border bg-muted ${i === 0 ? 'sm:col-span-2 aspect-video' : 'aspect-square'}`}
                  >
                    <img src={img} alt={`${part.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl border bg-muted">
                <Package className="h-16 w-16 text-muted-foreground/40" />
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{part.type}</Badge>
              <Badge variant="secondary">{part.category}</Badge>
              {part.featured && <Badge>Featured</Badge>}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold">{part.name}</h1>
            <p className="mt-2 font-display text-3xl font-bold text-primary">{formatPrice(part.price)}</p>
            <p className="mt-4 text-muted-foreground">
              {part.full_description || part.short_description}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">Condition</dt>
                <dd className="font-medium capitalize">{part.condition}</dd>
              </div>
              <div className="rounded-lg border bg-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">Stock</dt>
                <dd className="font-medium">{part.stock > 0 ? `${part.stock} available` : 'Out of stock'}</dd>
              </div>
              <div className="rounded-lg border bg-card px-4 py-3 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Compatible Mazda models</dt>
                <dd className="mt-1 font-medium">
                  {part.compatible_models.length > 0
                    ? part.compatible_models.join(', ')
                    : 'Contact us for compatibility'}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${BUSINESS.phone}`}>
                <Button variant="outline" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </a>
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
