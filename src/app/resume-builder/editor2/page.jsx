import { Suspense } from 'react';
import ResumeBuilderClient2 from './ResumeBuilderClient2';

export default function ResumeBuilderEditor2Page() {
  return (
    <Suspense fallback={null}>
      <ResumeBuilderClient2 />
    </Suspense>
  );
}
