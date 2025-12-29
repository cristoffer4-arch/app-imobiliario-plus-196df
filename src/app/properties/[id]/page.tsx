import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PropertyPT } from '@/types/property-pt';
import {
  generatePropertySEO,
  generateOpenGraphTags,
  generateTwitterCardTags,
  formatPriceEUR,
  formatArea,
  formatLocationPT,
  generateBreadcrumbSchema,
} from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Car,
  Zap,
  TrendingUp,
  Calendar,
  Euro,
} from 'lucide-react';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
    };
  }

  const propertyPT = property as PropertyPT;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app-imobiliario.pt'}/properties/${params.id}`;
  const seoData = generatePropertySEO(propertyPT, url);
  const ogTags = generateOpenGraphTags(propertyPT, url);
  const twitterTags = generateTwitterCardTags(propertyPT);

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      type: 'website',
      url: ogTags['og:url'],
      title: ogTags['og:title'],
      description: ogTags['og:description'],
      images: [
        {
          url: ogTags['og:image'],
          width: 1200,
          height: 630,
          alt: propertyPT.title,
        },
      ],
      siteName: ogTags['og:site_name'],
      locale: 'pt_PT',
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTags['twitter:title'],
      description: twitterTags['twitter:description'],
      images: [twitterTags['twitter:image']],
    },
    alternates: {
      canonical: url,
    },
  };
}

async function getProperty(id: string): Promise<PropertyPT | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as PropertyPT;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app-imobiliario.pt'}/properties/${params.id}`;
  const seoData = generatePropertySEO(property, url);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://app-imobiliario.pt' },
    { name: 'Imóveis', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app-imobiliario.pt'}/imoveis` },
    { name: property.title, url },
  ]);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{formatLocationPT(property.distrito, property.concelho, property.freguesia)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {formatPriceEUR(property.price)}
              </div>
              {property.condominio_mensal && (
                <p className="text-sm text-muted-foreground">
                  Condomínio: {formatPriceEUR(property.condominio_mensal)}/mês
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{property.tipologia}</Badge>
            {property.certificado_energetico && (
              <Badge variant="outline">Cert. {property.certificado_energetico}</Badge>
            )}
            {property.status && (
              <Badge>{property.status}</Badge>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 aspect-video rounded-lg overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {property.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${property.title} - Imagem ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key features */}
            <Card>
              <CardHeader>
                <CardTitle>Características Principais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Área</p>
                        <p className="font-semibold">{formatArea(property.area)}</p>
                      </div>
                    </div>
                  )}
                  {property.bedrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Quartos</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Casas de Banho</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.lugar_garagem !== undefined && (
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Garagem</p>
                        <p className="font-semibold">{property.lugar_garagem}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{property.description}</p>
              </CardContent>
            </Card>

            {/* Details tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="features">
                  <TabsList>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="costs">Custos</TabsTrigger>
                    <TabsTrigger value="location">Localização</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {property.elevador !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Elevador</span>
                          <span className="font-medium">{property.elevador ? 'Sim' : 'Não'}</span>
                        </div>
                      )}
                      {property.varanda !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Varanda</span>
                          <span className="font-medium">{property.varanda ? 'Sim' : 'Não'}</span>
                        </div>
                      )}
                      {property.arrecadacao !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Arrecadação</span>
                          <span className="font-medium">{property.arrecadacao ? 'Sim' : 'Não'}</span>
                        </div>
                      )}
                      {property.orientacao && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Orientação</span>
                          <span className="font-medium">{property.orientacao}</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {property.imi_anual && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IMI (anual)</span>
                          <span className="font-medium">{formatPriceEUR(property.imi_anual)}</span>
                        </div>
                      )}
                      {property.condominio_mensal && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Condomínio (mensal)</span>
                          <span className="font-medium">{formatPriceEUR(property.condominio_mensal)}</span>
                        </div>
                      )}
                      {property.imt_estimado && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IMT estimado</span>
                          <span className="font-medium">{formatPriceEUR(property.imt_estimado)}</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distrito</span>
                        <span className="font-medium">{property.distrito}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Concelho</span>
                        <span className="font-medium">{property.concelho}</span>
                      </div>
                      {property.freguesia && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Freguesia</span>
                          <span className="font-medium">{property.freguesia}</span>
                        </div>
                      )}
                      {property.zip_code && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Código Postal</span>
                          <span className="font-medium">{property.zip_code}</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <Card>
              <CardHeader>
                <CardTitle>Interessado?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">
                  Contactar
                </button>
                <button className="w-full border border-input py-2 px-4 rounded-md hover:bg-accent">
                  Agendar Visita
                </button>
              </CardContent>
            </Card>

            {/* Energy certificate */}
            {property.certificado_energetico && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Certificado Energético
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {property.certificado_energetico}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Classificação de eficiência energética
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ref.</span>
                  <span className="font-medium">{property.id.substring(0, 8)}</span>
                </div>
                {property.created_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publicado</span>
                    <span className="font-medium">
                      {new Date(property.created_at).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
