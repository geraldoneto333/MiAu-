'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';
import { getToken } from '@/lib/api';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

type SwaggerRequest = {
  headers?: Record<string, string>;
  [key: string]: unknown;
};

export default function DocsPage() {
  const requestInterceptor = useCallback((request: SwaggerRequest) => {
    const token = getToken();
    if (token) {
      request.headers = request.headers ?? {};
      if (!request.headers.Authorization) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }
    return request;
  }, []);

  const onComplete = useCallback((system: { authActions: { authorize: (auth: unknown) => void } }) => {
    const token = getToken();
    if (!token) return;
    system.authActions.authorize({
      BearerJWT: {
        name: 'BearerJWT',
        schema: { type: 'http', scheme: 'bearer', in: 'header' },
        value: token,
      },
    });
  }, []);

  const swaggerProps = useMemo(
    () => ({
      url: '/openapi.json',
      persistAuthorization: true,
      docExpansion: 'list' as const,
      requestInterceptor,
      onComplete,
    }),
    [requestInterceptor, onComplete],
  );

  return (
    <section id="sec-docs" className="content-section">
      <div className="swagger-docs-wrapper">
        <SwaggerUI {...swaggerProps} />
      </div>
    </section>
  );
}
