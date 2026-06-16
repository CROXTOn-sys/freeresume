import { Suspense } from 'react';
import TemplateDetailsClient from './TemplateDetailsClient';

export default function TemplateDetailsPage() {
  return (
    <Suspense fallback={null}>
      <TemplateDetailsClient />
    </Suspense>
  );
}
