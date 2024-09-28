import Script from 'next/script';

export default function GoogleTag() {
  return (
    <>
      {/* Google tag (gtag.js) for Google Ads Conversion Tracking */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-11237044944"
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Google Ads Conversion ID
          gtag('config', 'AW-11237044944');
        `}
      </Script>
    </>
  );
}