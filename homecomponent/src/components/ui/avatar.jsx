import * as React from 'react';

function Avatar({ children, className = '', ...props }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
      {children}
    </div>
  );
}

function AvatarImage({ src, alt, className = '', ...props }) {
  const [imageError, setImageError] = React.useState(false);

  if (imageError || !src) {
    return null;
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
      onError={() => setImageError(true)}
      {...props}
    />
  );
}

function AvatarFallback({ children, className = '', ...props }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
