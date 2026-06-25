import { Link } from 'react-router-dom';
import { MessageCircle, Package } from 'lucide-react';
import { Part } from '@/types/part';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { BUSINESS } from '@/lib/constants';
import { SiteImage } from '@/components/ui/SiteImage';

interface PartCardProps {
  part: Part;
  priority?: boolean;
}

export function PartCard({ part, priority = false }: PartCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${part.name} (${part.category}) listed on Autosystem.`
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card card-shadow transition-all duration-300 hover:card-shadow-hover hover-lift">
      <Link
        to={`/parts/${part.id}`}
        className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-neutral-100"
      >
        {part.images.length > 0 ? (
          <SiteImage
            src={part.images[0]}
            alt={part.name}
            optimizedWidth={520}
            quality={68}
            priority={priority}
            width={640}
            height={480}
            className="object-contain object-center p-3 sm:p-4"
            fallback={
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Package className="h-10 w-10 opacity-40" />
                <span className="text-xs">No image</span>
              </div>
            }
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Package className="h-10 w-10 opacity-40" />
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {part.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
          <Badge variant="secondary" className="capitalize">
            {part.type}
          </Badge>
          {part.stock <= 0 && <Badge variant="outline">Out of stock</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/parts/${part.id}`}>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">{part.category}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
            {part.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{part.short_description}</p>
        </Link>

        {part.compatible_models.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Fits: {part.compatible_models.slice(0, 3).join(', ')}
            {part.compatible_models.length > 3 ? '…' : ''}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <div>
            <span className="font-display text-xl font-bold text-primary">{formatPrice(part.price)}</span>
            <p className="text-xs text-muted-foreground capitalize">
              {part.condition} · {part.stock > 0 ? `${part.stock} in stock` : 'Unavailable'}
            </p>
          </div>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
