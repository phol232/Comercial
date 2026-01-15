import React from 'react';
import { AuthCheck } from './AuthCheck';
import { Hero } from './Hero';
import { SearchBar } from './SearchBar';
import { ContentSection } from './ContentSection';
import { ResourcesSection } from './ResourcesSection';
import { DemosSection } from './DemosSection';
import { CapsulesSection } from './CapsulesSection';
import { MaterialsSection } from './MaterialsSection';

export const Dashboard = () => {
  return (
    <AuthCheck>
      <Hero />
      <SearchBar />
      <ContentSection />
      <ResourcesSection />
      <DemosSection />
      <CapsulesSection />
      <MaterialsSection />
    </AuthCheck>
  );
};
