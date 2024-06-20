'use client'

import { ComponentType, ReactElement, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export default function withAuth<T extends {}>(WrappedComponent: ComponentType<T>) {
  const WithAuthComponent = (props: T & { children?: ReactNode }) => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    console.log('isAuthenticated in withAuth: ', isAuthenticated);
    
    useEffect(() => {
      if(!isLoading && !isAuthenticated){
        router.replace('signin');
      }
    }, [isAuthenticated, isLoading]);
    
    if (!isAuthenticated) {
      return <div>Loading...</div>; //TODO replace with a proper Loading component
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
}