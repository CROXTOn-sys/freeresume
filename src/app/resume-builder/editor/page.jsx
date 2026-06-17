import { Suspense } from 'react';
import ResumeBuilderClient from '../ResumeBuilderClient';

export default function ResumeBuilderEditorPage() {
  return (
    <Suspense fallback={null}>
      <ResumeBuilderClient />
    </Suspense>
  );
}
