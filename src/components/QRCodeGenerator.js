// components/QRCodeGenerator.js
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = React.memo(({ data = '' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating QR code generation delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (typeof data !== 'string' || data === null || data === undefined) {
    return null;
  }

  if (data === '') {
    return (
      <div>
        <h2>No data provided</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Generated QR Code</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <QRCode value={data} />
      )}
    </div>
  );
});

export default QRCodeGenerator
