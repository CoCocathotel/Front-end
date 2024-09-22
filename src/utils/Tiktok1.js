// TikTokEmbed.js
import React from 'react';

const TikTokEmbed = ({ url }) => {
  return (
    <div className="flex justify-center my-4">
      <iframe
        src={url}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-lg shadow-lg w-96 h-screen"
      ></iframe>
    </div>
  );
};

export default TikTokEmbed;
