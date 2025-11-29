
'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Feather, Sun, Thermometer, Search, X } from 'lucide-react';
import plantData from '@/lib/plant-data.json';
import type { Plant } from '@/types/plant';

export default function PlantDetailsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const filteredPlants = plantData.plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
          Explore Plants & Crops
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Discover growth cycles, care tips, and more for a variety of plants and crops.
        </p>
      </header>

      <div className="relative mb-8 max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a plant or crop..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="h-12 pl-12 pr-10 w-full rounded-full bg-card/50"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPlants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onSelect={() => setSelectedPlant(plant)}
          />
        ))}
      </div>

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
}

function PlantCard({ plant, onSelect }: { plant: Plant; onSelect: () => void }) {
  return (
    <Card
      onClick={onSelect}
      className="cursor-pointer group overflow-hidden bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-glow-primary/20"
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={plant.image}
            alt={plant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint="plant professional photo"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-center text-foreground truncate">{plant.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function PlantDetailModal({ plant, isOpen, onClose }: { plant: Plant; isOpen: boolean; onClose: () => void; }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card/80 backdrop-blur-lg">
        <DialogHeader>
          <div className="relative h-64 w-full rounded-t-lg overflow-hidden mb-4">
            <Image
              src={plant.image}
              alt={plant.name}
              fill
              className="object-cover"
              data-ai-hint="plant cinematic photo"
            />
          </div>
          <DialogTitle className="text-3xl font-bold">{plant.name}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            {plant.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Growth Timeline */}
          <div className="space-y-4">
             <h3 className="text-xl font-bold">Growth Timeline</h3>
             <div className="relative flex justify-between items-start w-full pt-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
               {plant.growth.stages.map((stage) => (
                <div key={stage.name} className="relative z-10 flex flex-col items-center w-1/4">
                  <div className="h-4 w-4 rounded-full bg-card border-2 border-primary mb-2"></div>
                  <p className="font-bold text-center text-xs md:text-sm">{stage.name}</p>
                  <p className="text-muted-foreground text-xs">{stage.duration}</p>
                </div>
              ))}
            </div>
             <p className='text-center text-sm text-muted-foreground pt-4'>Total maturity: {plant.growth.total_duration}</p>
          </div>
          
          {/* Care Requirements */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Care Requirements</h3>
            <div className='space-y-3'>
              <CareItem icon={Droplets} title="Water" value={plant.care.water} />
              <CareItem icon={Sun} title="Sunlight" value={plant.care.sunlight} />
              <CareItem icon={Thermometer} title="Temperature" value={plant.care.temperature} />
              <CareItem icon={Feather} title="Fertilizer" value={plant.care.fertilizer} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const CareItem = ({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string; }) => (
  <div className="flex gap-4">
    <div className="p-2 bg-secondary rounded-full mt-1 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);
