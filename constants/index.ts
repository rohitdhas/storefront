export const ORDER_STATUS: any = {
  Created: {
    type: "warning",
    icon: "pi-exclamation-triangle",
  },
  Received: {
    type: "info",
    icon: "pi-info-circle",
  },
  Shipped: {
    type: "primary",
    icon: "pi-box",
  },
  Delivered: {
    type: "success",
    icon: "pi-check",
  },
  Cancelled: {
    type: "error",
    icon: "pi-times",
  },
};

export const PAGE_LOADER_BLACKLIST: string[] = ["/products"];

export const HOT_DEAL_PRODUCT = {
  _id: "6354e3720ee5b58784826509",
  title: "Boult Audio AirBass",
  description:
    "Our all-new Airbuds. Its 40mm drivers pump out Boult Signature Sound for 40 hours non-stop. Click on the dedicated BEAST™ Mode button on these bluetooth headphones and prepare to slay your opponents with a quicker reaction time induced by a reduced delay in sound. Wear it, play it!",
  images: [
    "6354e3720ee5b58784826509_-original-imaga4m8sz5ymcf7.webp",
    "6354e3720ee5b58784826509_-original-imaga4m8gzmyz2vx.webp",
    "6354e3720ee5b58784826509_-original-imaga4m8hxuarfqm.webp",
  ],
  currentPrice: 1399,
  originalPrice: 5949,
};
